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
      var queryResultsFilter = client.QueryAsync<TableEntity>();
      Azure.Page<TableEntity> result = null;

      await foreach (Azure.Page<TableEntity> page in queryResultsFilter.AsPages())
      {
        result = page;
      }

      return new OkObjectResult(result);
    }
  }
}
