using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
  public static class GetEvent
  {
    [FunctionName("GetEvent")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getEvent/{id}")] HttpRequest req,
      string id,
      ILogger log
    )
    {
      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);

      // Parse the id from the URL route
      if (!int.TryParse(id, out int eventId))
      {
        return new BadRequestObjectResult("Invalid event ID");
      }

      // Construct the filter to retrieve a specific row based on RowKey only
      var filter = TableClient.CreateQueryFilter($"RowKey eq '{eventId}'");

      var queryResults = client.QueryAsync<TableEntity>(filter);

      var result = new List<TableEntity>();

      await foreach (var page in queryResults.AsPages())
      {
        foreach (var entity in page.Values)
        {
          result.Add(entity);
        }
      }

      // Since we're querying based on RowKey only, we expect only one result
      var eventResult = result.FirstOrDefault();

      if (eventResult == null)
      {
        return new NotFoundResult();
      }

      return new OkObjectResult(eventResult);
    }
  }
}
