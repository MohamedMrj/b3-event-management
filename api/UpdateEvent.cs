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
  public static class UpdateEvent
  {
    [FunctionName("UpdateEvent")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "event/{id}")] HttpRequest req,
      string id,
      ILogger log
    )
    {
      var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var updatedEventData = JsonSerializer.Deserialize<JsonElement>(requestBody);

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);

      var filter = $"RowKey eq '{id}'";
      var queryResults = client.QueryAsync<TableEntity>(filter);
      TableEntity eventEntity = null;

      await foreach (var entity in queryResults)
      {
        eventEntity = entity;
        break;
      }

      if (eventEntity == null)
      {
        return new NotFoundResult();
      }

      eventEntity["Title"] = updatedEventData.GetProperty("title").GetString();
      eventEntity["LongDescription"] = updatedEventData.GetProperty("longDescription").GetString();
      eventEntity["ShortDescription"] = updatedEventData
        .GetProperty("shortDescription")
        .GetString();
      eventEntity["LocationStreet"] = updatedEventData.GetProperty("locationStreet").GetString();
      eventEntity["LocationCity"] = updatedEventData.GetProperty("locationCity").GetString();
      eventEntity["LocationCountry"] = updatedEventData.GetProperty("locationCountry").GetString();
      eventEntity["CreatorUserID"] = updatedEventData.GetProperty("organizer").GetString();
      eventEntity["StartDateTime"] = updatedEventData.GetProperty("startDateTime").GetString();
      eventEntity["EndDateTime"] = updatedEventData.GetProperty("endDateTime").GetString();
      eventEntity["Timezone"] = updatedEventData.GetProperty("timezone").GetString();
      eventEntity["ImageUrl"] = updatedEventData.GetProperty("imageUrl").GetString();
      eventEntity["ImageAlt"] = updatedEventData.GetProperty("imageAlt").GetString();

      try
      {
        await client.UpdateEntityAsync(eventEntity, Azure.ETag.All, TableUpdateMode.Replace);
      }
      catch (Exception ex)
      {
        log.LogError($"Could not update event: {ex.Message}");
        return new BadRequestObjectResult("Error updating the event.");
      }

      return new OkObjectResult(
        new
        {
          id = eventEntity.RowKey,
          title = eventEntity["Title"],
          longDescription = eventEntity["LongDescription"],
          shortDescription = eventEntity["ShortDescription"],
          locationStreet = eventEntity["LocationStreet"],
          locationCity = eventEntity["LocationCity"],
          locationCountry = eventEntity["LocationCountry"],
          organizer = eventEntity["CreatorUserID"],
          startDateTime = eventEntity["StartDateTime"],
          endDateTime = eventEntity["EndDateTime"],
          timezone = eventEntity["Timezone"],
          imageUrl = eventEntity["ImageUrl"],
          imageAlt = eventEntity["ImageAlt"],
        }
      );
    }
  }
}
