using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Security.Cryptography;
using System.Text;
using System;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public class UserEntityTest : TableEntity
{
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string Salt { get; set; }
}

namespace B3.Complete.Eventwebb
{
    public static class AuthenticationManager
    {
        private static readonly string secretKey = "ZczdEdVxhn78Y3dF7v67HfzhVT8fzDF6ddGT4UeTC6zRK9gL7Kxrt6VMogqmCwQw"; // Consider using Azure Key Vault
        private static readonly string storageConnectionString = DatabaseConfig.ConnectionString;
        private static CloudTableClient tableClient;
        private static CloudTable usersTable;

        static AuthenticationManager()
        {
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            tableClient = storageAccount.CreateCloudTableClient();
            usersTable = tableClient.GetTableReference(DatabaseConfig.TableNameUsersTest);
        }

        [FunctionName("CreateUser")]
        public static async Task<IActionResult> CreateUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "createUser")] HttpRequest req)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string username = data?.username;
            string password = data?.password;

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return new BadRequestObjectResult("Missing information.");
            }

            // Check if user already exists
            TableQuery<UserEntityTest> query = new TableQuery<UserEntityTest>()
                .Where(TableQuery.GenerateFilterCondition("Username", QueryComparisons.Equal, username));
            var queryResult = await usersTable.ExecuteQuerySegmentedAsync(query, null);
            var existingUser = queryResult.Results.FirstOrDefault();
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

            TableOperation insertOperation = TableOperation.Insert(newUser);
            await usersTable.ExecuteAsync(insertOperation);

            return new OkObjectResult("User created successfully.");
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

        [FunctionName("SignIn")]
        public static async Task<IActionResult> SignIn(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string username = data?.username;
            string password = data?.password;

            // Query to find the user by username
            TableQuery<UserEntityTest> query = new TableQuery<UserEntityTest>()
                .Where(TableQuery.GenerateFilterCondition("Username", QueryComparisons.Equal, username));

            // Execute the query
            var queryResult = await usersTable.ExecuteQuerySegmentedAsync(query, null);
            var userEntity = queryResult.Results.FirstOrDefault();
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

            return new OkObjectResult(new { token = token });
        }

        [FunctionName("ValidateToken")]
        public static IActionResult ValidateToken(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "validateToken")] HttpRequest req)
        {
            if (!req.Headers.ContainsKey("Authorization"))
                return new BadRequestObjectResult(new { error = "Missing Authorization header." });

            var token = req.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var validationResponse = TryValidateTokenDetailed(token);

            if (!validationResponse.IsValid)
            {
                // Construct a detailed error response
                return new BadRequestObjectResult(new
                {
                    error = "Invalid token.",
                    reason = validationResponse.Error,
                    serverTime = DateTime.UtcNow.ToString("o"), // ISO 8601 format for clarity
                    debugInfo = new
                    {
                        secretKeyUsedForValidation = secretKey, // Warning: Highly sensitive, remove before production!
                        tokenReceived = token // Consider the security implications of returning the token
                    }
                });
            }

            return new OkObjectResult(new { valid = true, message = "Token is valid." });
        }

        // This method attempts to validate the token and returns detailed information about the attempt
        private static (bool IsValid, string Error) TryValidateTokenDetailed(string token)
        {
            if (string.IsNullOrEmpty(token))
                return (false, "Token is null or empty.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return (true, null); // Token is valid
            }
            catch (Exception ex)
            {
                return (false, ex.Message); // Return the exception message for debugging
            }
        }

        // ------------------- //

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

        private static ClaimsPrincipal ValidateJwtToken(string token)
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
        public static bool TryValidateToken(string token, out ClaimsPrincipal principal)
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
                return false;
            }
        }
    }
}
