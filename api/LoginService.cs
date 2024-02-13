using System;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;

public class UserEntity : TableEntity
{
    public string Email { get; set; }
    public string Password { get; set; }
}

namespace B3.Complete.Eventwebb
{
    public static class LoginFunction
    {
        [FunctionName("Login")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "login")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            try
            {
                // Read the request body to get email and password
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);
                string email = data?.email;
                string password = data?.password;

                log.LogInformation($"Received request with email: {email}");

                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                {
                    log.LogError("Email or password is null or empty.");
                    return new BadRequestObjectResult("Email and password are required.");
                }

                // Retrieve the user entity from the Azure Table Storage by performing a table scan
                CloudTable table = GetCloudTable();
                TableQuery<UserEntity> query = new TableQuery<UserEntity>();
                TableQuerySegment<UserEntity> queryResult = await table.ExecuteQuerySegmentedAsync(query, null);

                foreach (UserEntity userEntity in queryResult)
                {
                    if (userEntity.Email == email && userEntity.Password == password)
                    {
                        // Generate JWT token
                        string token = GenerateJwtToken(email);

                        // Return token in the response
                        return new OkObjectResult(new { token });
                    }
                }

                // If no matching user found
                log.LogWarning("No matching user found.");
                return new BadRequestObjectResult("Invalid email or password.");
            }
            catch (Exception ex)
            {
                log.LogError($"An error occurred: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private static CloudTable GetCloudTable()
        {
            // Retrieve the connection string and table name from DatabaseConfig
            string connectionString = DatabaseConfig.ConnectionString;
            string tableName = DatabaseConfig.TableNameUsers;

            // Create CloudTableClient using the connection string
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

            // Get reference to your table
            CloudTable table = tableClient.GetTableReference(tableName);

            return table;
        }

        private static string GenerateJwtToken(string email)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_new_key_with_at_least_128_bits"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Change Issuer and Audience to your own values and your_secret_key after testing
            var token = new JwtSecurityToken(
                issuer: "your_issuer",
                audience: "your_audience",
                claims: new[] { new Claim("email", email) },
                expires: DateTime.UtcNow.AddHours(1), // Token expiration time
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}