using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
    public static class LoginService
    {
        [FunctionName("Login")]
        public static async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "login")] HttpRequest req,
          ILogger log
        )
        {
            // Console.WriteLine(req.Body);
            // var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            // var loginData = JsonSerializer.Deserialize<JsonElement>(requestBody);

            // var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);



            return new OkObjectResult(true);
        }
    }
}
