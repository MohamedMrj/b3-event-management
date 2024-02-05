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
  public static class CreateEvent
  {
    [FunctionName("CreateEvent")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "event")] HttpRequest req,
      ILogger log
    )
    {
      var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var eventData = JsonSerializer.Deserialize<JsonElement>(requestBody);

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);

      // Retrieve the highest RowKey value
      int maxRowKey = await GetMaxRowKey(client, log) + 1;

      var newEvent = new TableEntity
      {
        PartitionKey = DateTime.UtcNow.ToString("yyyyMM"),
        RowKey = maxRowKey.ToString(), // Use the next RowKey value
        ["Title"] = eventData.GetProperty("title").GetString(),
        ["LongDescription"] = eventData.GetProperty("longDescription").GetString(),
        ["ShortDescription"] = eventData.GetProperty("shortDescription").GetString(),
        ["LocationStreet"] = eventData.GetProperty("locationStreet").GetString(),
        ["LocationCity"] = eventData.GetProperty("locationCity").GetString(),
        ["LocationCountry"] = eventData.GetProperty("locationCountry").GetString(),
        ["CreatorUserID"] = eventData.GetProperty("organizer").GetString(),
        ["StartDateTime"] = eventData.GetProperty("startDateTime").GetString(),
        ["EndDateTime"] = eventData.GetProperty("endDateTime").GetString(),
        ["Timezone"] = eventData.GetProperty("timezone").GetString(),
        ["ImageUrl"] = eventData.GetProperty("imageUrl").GetString(),
        ["ImageAlt"] = eventData.GetProperty("imageAlt").GetString(),
      };

      try
      {
        await client.AddEntityAsync(newEvent);
      }
      catch (Exception ex)
      {
        log.LogError($"Could not insert new event: {ex.Message}");
        return new BadRequestObjectResult("Error creating the event.");
      }

      // Prepare the response entity to match the specified fields
      var responseEntity = new
      {
        id = newEvent.RowKey,
        title = newEvent["Title"],
        longDescription = newEvent["LongDescription"],
        shortDescription = newEvent["ShortDescription"],
        locationStreet = newEvent["LocationStreet"],
        locationCity = newEvent["LocationCity"],
        locationCountry = newEvent["LocationCountry"],
        organizer = newEvent["CreatorUserID"],
        startDateTime = newEvent["StartDateTime"],
        endDateTime = newEvent["EndDateTime"],
        timezone = newEvent["Timezone"],
        imageUrl = newEvent["ImageUrl"],
        imageAlt = newEvent["ImageAlt"],
      };

      return new OkObjectResult(responseEntity);
    }

    private static async Task<int> GetMaxRowKey(TableClient client, ILogger log)
    {
      int maxRowKey = 0;
      await foreach (var entity in client.QueryAsync<TableEntity>(select: new[] { "RowKey" }))
      {
        if (int.TryParse(entity.RowKey, out int currentKey) && currentKey > maxRowKey)
        {
          maxRowKey = currentKey;
        }
      }
      return maxRowKey;
    }
  }
}
