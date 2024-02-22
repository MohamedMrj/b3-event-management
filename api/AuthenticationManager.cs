using Azure;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.IO;

public class UserEntityTest : ITableEntity
{
    public string? Username { get; set; }
    public string? PasswordHash { get; set; }
    public string? Salt { get; set; }
    public string? PartitionKey { get; set; }
    public string? RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}

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
        private static readonly string secretKey = "ZczdEdVxhn78Y3dF7v67HfzhVT8fzDF6ddGT4UeTC6zRK9gL7Kxrt6VMogqmCwQw";
        private static readonly TableClient usersTable = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);

        [Function(nameof(CreateUser))]
        public static async Task<HttpResponseData> CreateUser([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "createUser")] HttpRequestData req, FunctionContext context)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserCredentials>(requestBody);
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
            UserEntityTest newUser = new UserEntityTest
            {
                PartitionKey = "User",
                RowKey = Guid.NewGuid().ToString(),
                Username = data.Username,
                PasswordHash = passwordHash,
                Salt = salt
            };

            await usersTable.AddEntityAsync(newUser);
            await response.WriteStringAsync("User created successfully.");
            return response;
        }

        [Function(nameof(SignIn))]
        public static async Task<HttpResponseData> SignIn([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req, FunctionContext context)
        {
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
            if (userEntity == null || string.IsNullOrEmpty(userEntity.PasswordHash) || string.IsNullOrEmpty(userEntity.Salt))
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                var errorResponse = JsonConvert.SerializeObject(new { error = "User not found or invalid credentials." });
                await response.WriteStringAsync(errorResponse);
                return response;
            }

            bool isPasswordValid = VerifyPasswordHash(data.Password, userEntity.PasswordHash!, userEntity.Salt!);
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

            var token = GenerateJwtToken(userEntity.RowKey!, data.Username);
            var tokenResponse = JsonConvert.SerializeObject(new { token = token });
            await response.WriteStringAsync(tokenResponse);
            return response;
        }

        [Function(nameof(ValidateToken))]
        public static async Task<HttpResponseData> ValidateToken([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "validateToken")] HttpRequestData req, FunctionContext context)
        {
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
            var entities = usersTable.QueryAsync<UserEntityTest>($"PartitionKey eq 'User' and Username eq '{username}'");
            await foreach (var entity in entities)
            {
                return true;
            }
            return false;
        }

        private static async Task<UserEntityTest?> GetUserEntity(string username)
        {
            // Assuming usersTable is correctly initialized and usable
            var entities = usersTable.QueryAsync<UserEntityTest>($"PartitionKey eq 'User' and Username eq '{username}'");
            await foreach (var entity in entities)
            {
                return entity;
            }
            return null;
        }

        private static string GenerateJwtToken(string userId, string username)
        {
            var tokenHandler = new JsonWebTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Name, username)
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
