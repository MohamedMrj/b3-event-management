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
  public static class GetUser
  {
    [FunctionName("GetUser")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user/{id}")] HttpRequest req,
      string id,
      ILogger log
    )
    {
      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);

      // Parse the id from the URL route
      if (!int.TryParse(id, out int userId))
      {
        return new BadRequestObjectResult("Invalid user ID");
      }

      // Construct the filter to retrieve a specific row based on RowKey only
      var filter = TableClient.CreateQueryFilter($"RowKey eq '{userId}'");

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
      var userResult = result.FirstOrDefault();

      if (userResult == null)
      {
        return new NotFoundResult();
      }

      // Transform the retrieved data into the desired format
      var transformedUserData = new
      {
        id = userResult.RowKey,
        firstName = userResult["FirstName"],
        lastName = userResult["LastName"],
        email = userResult["Email"],
        phone = userResult["PhoneNumber"],
      };

      return new OkObjectResult(transformedUserData);
    }
  }
}
