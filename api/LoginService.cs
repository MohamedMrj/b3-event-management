using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
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

            // Read the request body to get email and password
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string email = data?.email;
            string password = data?.password;

            log.LogInformation($"Received request with email: {email}");

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
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
                    // Authentication successful
                    return new OkResult();
                }
            }

            // If no matching user found
            return new BadRequestObjectResult("Invalid email or password.");
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
    }
}