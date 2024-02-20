using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace B3.Complete.Eventwebb
{
  public static class GetEvent
  {
    [Function(nameof(GetEvent))]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "event/{id}")] HttpRequest req,
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

      // Transform the retrieved data into the desired format
      var transformedEventData = new
      {
        id = eventResult.RowKey,
        title = eventResult["Title"],
        longDescription = eventResult["LongDescription"],
        shortDescription = eventResult["ShortDescription"],
        locationStreet = eventResult["LocationStreet"],
        locationCity = eventResult["LocationCity"],
        locationCountry = eventResult["LocationCountry"],
        creatorUserId = eventResult["CreatorUserID"],
        startDateTime = eventResult["StartDateTime"].ToString(),
        endDateTime = eventResult["EndDateTime"].ToString(),
        image = eventResult["Image"],
        imageAlt = eventResult["ImageAlt"],
      };

      return new OkObjectResult(transformedEventData);
    }
  }
}
