using Azure;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

public class UserEntityTest : ITableEntity
{
    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    public required string Salt { get; set; }
    public required string PartitionKey { get; set; }
    public required string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}

public class UserCredentials
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}

namespace B3.Complete.Eventwebb
{
    public static class AuthenticationManager
    {
        private static readonly string secretKey = "ZczdEdVxhn78Y3dF7v67HfzhVT8fzDF6ddGT4UeTC6zRK9gL7Kxrt6VMogqmCwQw"; // Consider using Azure Key Vault
        private static readonly TableClient usersTable;

        static AuthenticationManager()
        {
            usersTable = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableNameUsersTest);
        }

        [Function(nameof(CreateUser))]
        public static async Task<IActionResult> CreateUser([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "createUser")] HttpRequest req)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserCredentials>(requestBody);

            if (data == null || string.IsNullOrEmpty(data.Username) || string.IsNullOrEmpty(data.Password))
            {
                return new BadRequestObjectResult("Missing information.");
            }

            // Use data.Username and data.Password here
            string username = data.Username;
            string password = data.Password;

            // Check if user already exists
            UserEntityTest? existingUser = null;
            await foreach (var user in usersTable.QueryAsync<UserEntityTest>($"PartitionKey eq 'User' and Username eq '{username}'"))
            {
                existingUser = user;
                break; // Break after finding the first user
            }

            if (existingUser != null)
            {
                return new BadRequestObjectResult("User already exists.");
            }

            // Generate salt and hash password
            var (passwordHash, salt) = CreatePasswordHash(password);

            // Create and store user entity
            UserEntityTest newUser = new UserEntityTest
            {
                PartitionKey = "User",
                RowKey = Guid.NewGuid().ToString(),
                Username = username,
                PasswordHash = passwordHash,
                Salt = salt
            };

            await usersTable.AddEntityAsync(newUser);

            return new OkObjectResult("User created successfully.");
        }
        [Function(nameof(SignIn))]
        public static async Task<IActionResult> SignIn([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req)
        {
            // Read the request body and deserialize it to the UserCredentials object
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonConvert.DeserializeObject<UserCredentials>(requestBody);

            // Check if the deserialized data or its critical properties are null or empty
            if (data == null || string.IsNullOrEmpty(data.Username) || string.IsNullOrEmpty(data.Password))
            {
                return new BadRequestObjectResult("Missing information.");
            }

            // Now that data is confirmed to be non-null, access the username and password through it
            string username = data.Username;
            string password = data.Password;

            // Continue with your logic to verify the user's identity
            // Explicitly declare userEntity as nullable
            UserEntityTest? userEntity = null;
            await foreach (var user in usersTable.QueryAsync<UserEntityTest>($"PartitionKey eq 'User' and Username eq '{username}'"))
            {
                userEntity = user;
                break; // Break after finding the first matching user
            }

            if (userEntity == null)
            {
                return new BadRequestObjectResult("User not found.");
            }

            // Verify the password
            if (!VerifyPasswordHash(password, userEntity.PasswordHash, userEntity.Salt))
            {
                return new BadRequestObjectResult("Invalid credentials.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(userEntity.RowKey); // Or use a unique identifier other than RowKey

            // Return success response with the token
            return new OkObjectResult(new { token = token });
        }


        [Function(nameof(ValidateToken))]
        public static IActionResult ValidateToken(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "validateToken")] HttpRequest req)
        {
            if (!req.Headers.ContainsKey("Authorization"))
                return new BadRequestObjectResult(new { error = "Missing Authorization header." });

            var token = req.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var principal = ValidateJwtToken(token);
            if (principal == null)
            {
                return new BadRequestObjectResult(new { error = "Invalid token." });
            }

            // Return a JSON response
            return new OkObjectResult(new { valid = true, message = "Token is valid." });
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

        private static string GenerateJwtToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static ClaimsPrincipal? ValidateJwtToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return validatedToken is JwtSecurityToken jwtSecurityToken
                    ? new ClaimsPrincipal(new ClaimsIdentity(jwtSecurityToken.Claims))
                    : null;
            }
            catch
            {
                return null;
            }
        }


        // Public method to validate token
        public static bool TryValidateToken(string token, out ClaimsPrincipal? principal)
        {
            principal = null;
            if (string.IsNullOrEmpty(token))
                return false;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            try
            {
                principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                // Token is valid
                return true;
            }
            catch
            {
                // Token validation failed
                principal = null; // Explicitly null for clarity, though it's already set above
                return false;
            }
        }

    }
}
