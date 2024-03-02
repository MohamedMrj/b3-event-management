using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

public class UserCredentials
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public class TokenRequest
{
    public string Token { get; set; } = string.Empty;
}

namespace B3.Complete.Eventwebb
{
    public static class AuthenticationManager
    {
        private static readonly string secretKey = Constants.JwtSecretKey;
        private static readonly TableClient usersTable = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);

        [Function(nameof(CreateUser))]
        public static async Task<HttpResponseData> CreateUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "users")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("AuthenticationManager");
            log.LogInformation("Creating user.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserEntity>(requestBody);

            if (data == null || string.IsNullOrEmpty(data.Username) || string.IsNullOrEmpty(data.Password))
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                await response.WriteStringAsync("Missing information.");
                return response;
            }

            if (await UserExists(data.Username))
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                await response.WriteStringAsync("User already exists.");
                return response;
            }

            var (passwordHash, salt) = CreatePasswordHash(data.Password);
            UserEntity newUser = new UserEntity
            {
                PartitionKey = "User",
                RowKey = Guid.NewGuid().ToString(),
                UserType = data.UserType,
                Username = data.Username,
                Password = passwordHash,
                Salt = salt,
                FirstName = data.FirstName,
                LastName = data.LastName,
                PhoneNumber = data.PhoneNumber,
                Avatar = data.Avatar
            };

            await usersTable.AddEntityAsync(newUser);
            await response.WriteStringAsync("User created successfully.");
            return response;
        }

        [Function(nameof(SignIn))]
        public static async Task<HttpResponseData> SignIn(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("AuthenticationManager");
            log.LogInformation("Signing in user.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserCredentials>(requestBody);

            if (data == null || string.IsNullOrEmpty(data.Username) || string.IsNullOrEmpty(data.Password))
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                var errorResponse = JsonConvert.SerializeObject(new { error = "Missing information." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            var userEntity = await GetUserEntity(data.Username);
            if (userEntity == null || string.IsNullOrEmpty(userEntity.Password) || string.IsNullOrEmpty(userEntity.Salt))
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                var errorResponse = JsonConvert.SerializeObject(new { error = "User not found or invalid credentials." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            bool isPasswordValid = VerifyPasswordHash(data.Password, userEntity.Password!, userEntity.Salt!);
            if (!isPasswordValid)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                var errorResponse = JsonConvert.SerializeObject(new { error = "Invalid credentials." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            if (string.IsNullOrEmpty(userEntity.RowKey))
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                var errorResponse = JsonConvert.SerializeObject(new { error = "Error generating token." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            var token = GenerateJwtToken(userEntity.RowKey!, data.Username!, userEntity.UserType!);
            var tokenResponse = JsonConvert.SerializeObject(new { token = token });
            await response.WriteStringAsync(tokenResponse);
            return response;
        }

        [Function(nameof(ValidateToken))]
        public static async Task<HttpResponseData> ValidateToken(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "validateToken")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("AuthenticationManager");
            log.LogInformation("Validating user token.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var tokenRequest = JsonConvert.DeserializeObject<TokenRequest>(requestBody);

            if (tokenRequest == null || string.IsNullOrEmpty(tokenRequest.Token))
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                var errorResponse = JsonConvert.SerializeObject(new { valid = false, error = "Missing token." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            var (isValid, principal) = await TryValidateToken(tokenRequest.Token);
            if (!isValid)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                var errorResponse = JsonConvert.SerializeObject(new { valid = false, error = "Invalid token." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            var validResponse = JsonConvert.SerializeObject(new { valid = true, message = "Token is valid." });
            await response.WriteStringAsync(validResponse);
            return response;
        }

        // Helper Methods

        private static async Task<bool> UserExists(string username)
        {
            // Assuming usersTable is correctly initialized and usable
            var entities = usersTable.QueryAsync<UserEntity>($"PartitionKey eq 'User' and Username eq '{username}'");
            await foreach (var entity in entities)
            {
                return true;
            }
            return false;
        }

        private static async Task<UserEntity?> GetUserEntity(string username)
        {
            // Assuming usersTable is correctly initialized and usable
            var entities = usersTable.QueryAsync<UserEntity>($"PartitionKey eq 'User' and Username eq '{username}'");
            await foreach (var entity in entities)
            {
                return entity;
            }
            return null;
        }

        private static string GenerateJwtToken(string userId, string username, string UserType)
        {
            var tokenHandler = new JsonWebTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, UserType),
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            // Use the CreateToken method of JsonWebTokenHandler to create a token string directly
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return token;
        }

        private static async Task<ClaimsPrincipal?> ValidateJwtToken(string token)
        {
            var tokenHandler = new JsonWebTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            var tokenValidationResult = await tokenHandler.ValidateTokenAsync(token, validationParameters);
            if (!tokenValidationResult.IsValid)
            {
                return null;
            }

            var claims = tokenValidationResult.ClaimsIdentity.Claims;
            return new ClaimsPrincipal(new ClaimsIdentity(claims));
        }

        // Public method to validate token
        public static async Task<(bool IsValid, ClaimsPrincipal? Principal)> TryValidateToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                return (false, null);

            var tokenHandler = new JsonWebTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            var tokenValidationResult = await tokenHandler.ValidateTokenAsync(token, validationParameters);
            if (tokenValidationResult.IsValid)
            {
                var principal = new ClaimsPrincipal(new ClaimsIdentity(tokenValidationResult.ClaimsIdentity.Claims));
                return (true, principal);
            }

            return (false, null);
        }

        private static (string, string) CreatePasswordHash(string password)
        {
            using (var hmac = new HMACSHA512())
            {
                var salt = Convert.ToBase64String(hmac.Key);
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                var passwordHash = Convert.ToBase64String(hash);
                return (passwordHash, salt);
            }
        }

        private static bool VerifyPasswordHash(string password, string storedHash, string storedSalt)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);
            byte[] saltBytes = Convert.FromBase64String(storedSalt);
            using (var hmac = new HMACSHA512(saltBytes))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != hashBytes[i]) return false;
                }
            }
            return true;
        }
    }
}
