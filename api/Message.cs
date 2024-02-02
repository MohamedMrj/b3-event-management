using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure.Data.Tables;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace B3.Complete.Eventwebb
{
  public static class Event
    {
            // Denna sträng ska krypteras med Azure.Identity och läggas i Azure Key Vault efter testning
        private const string connectionString = "DefaultEndpointsProtocol=https;AccountName=b3eventwebbstorage;AccountKey=URmuupob95237E59Gg4dUKCdIo6dYp9w/hgT4Ras/0FsDK4b82RB+JD1oPYi6dPJV5lhIHdVZFHh+ASta2XhWw==;EndpointSuffix=core.windows.net";
        // Sätter vilket table som data ska hämtas från
       
        private const string tableName = "Test";
        [FunctionName("GetAllEvents")]
        public static async Task<IActionResult> GeAllEvents(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get",Route = null)] HttpRequest req,
            ILogger log)
        {
            var client = new TableClient(connectionString, tableName);
            var queryResultsFilter = client.QueryAsync<TableEntity>();
            Azure.Page<TableEntity> result = null;

            
            await foreach (Azure.Page<TableEntity> page in queryResultsFilter.AsPages())
            {
                result = page;
            }

            return new OkObjectResult(result);
        }
                [FunctionName("GetEvent")]
        public static async Task<IActionResult> GetEvent(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "event/{id}")] HttpRequest req,
    string id,
    ILogger log)
{
    var client = new TableClient(connectionString, tableName);

    // Parse the id from the URL route
    if (!int.TryParse(id, out int eventId))
    {
        return new BadRequestObjectResult("Invalid event ID");
    }

    // Construct the filter to retrieve a specific row based on PartitionKey and RowKey
    var filter = TableClient.CreateQueryFilter($"PartitionKey eq '{eventId}' and RowKey eq '{eventId}'");

    var queryResults = client.QueryAsync<TableEntity>(filter);

    var result = new List<TableEntity>();

    await foreach (var page in queryResults.AsPages())
    {
        foreach (var entity in page.Values)
        {
            result.Add(entity);
        }
    }

    // Since we're querying based on PartitionKey and RowKey, we expect only one result
    var eventResult = result.FirstOrDefault();

    if (eventResult == null)
    {
        return new NotFoundResult();
    }

    return new OkObjectResult(eventResult);
}
        
        [FunctionName("CreateEvent")]
        public static async Task<IActionResult> CreateEvent(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post",Route = null)] HttpRequest req,
            ILogger log)
        {
            var client = new TableClient(connectionString, tableName);
            var queryResultsFilter = client.QueryAsync<TableEntity>();
            Azure.Page<TableEntity> result = null;
            log.LogInformation("Creating an event");
            string requestData = await new StreamReader(req.Body).ReadToEndAsync();

            
            await foreach (Azure.Page<TableEntity> page in queryResultsFilter.AsPages())
            {
                result = page;
            }

            return new OkObjectResult(result);
        }
    }
}
