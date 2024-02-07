using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
    public static class GetAllEvents
    {
        [FunctionName("GetAllEvents")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log
        )
        {
            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);
            var queryResults = client.QueryAsync<EventEntity>(); // Using the specific EventEntity class

            var eventsList = new List<EventEntity>(); // Changed from List<object> to List<EventEntity>

            await foreach (var entity in queryResults)
            {
                eventsList.Add(entity);
            }

            if (eventsList.Count == 0)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(eventsList);
        }
    }
}
