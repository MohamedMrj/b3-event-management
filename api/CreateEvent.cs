using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
  public static class CreateEvent
  {
    [Function(nameof(CreateEvent))]
    public static async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "event")] HttpRequestData req,
        FunctionContext executionContext)
    {
      var log = executionContext.GetLogger("CreateEvent");
      log.LogInformation("Creating a new event");

      string requestBody;
      using (var reader = new StreamReader(req.Body))
      {
        requestBody = await reader.ReadToEndAsync();
      }

      JsonElement eventData;
      try
      {
        eventData = JsonSerializer.Deserialize<JsonElement>(requestBody);
      }
      catch (JsonException ex)
      {
        log.LogError($"JSON parsing error: {ex.Message}");
        var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
        await badRequestResponse.WriteStringAsync("Invalid JSON format.");
        return badRequestResponse;
      }

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);

      var newEvent = new TableEntity
      {
        PartitionKey = DateTime.UtcNow.ToString("yyyyMM"),
        RowKey = Guid.NewGuid().ToString(), // Use GUID for RowKey
        ["Title"] = eventData.GetProperty("title").GetString(),
        ["LongDescription"] = eventData.GetProperty("longDescription").GetString(),
        ["ShortDescription"] = eventData.GetProperty("shortDescription").GetString(),
        ["LocationStreet"] = eventData.GetProperty("locationStreet").GetString(),
        ["LocationCity"] = eventData.GetProperty("locationCity").GetString(),
        ["LocationCountry"] = eventData.GetProperty("locationCountry").GetString(),
        ["CreatorUserID"] = eventData.GetProperty("creatorUserId").GetString(),
        ["StartDateTime"] = eventData.GetProperty("startDateTime").GetString(),
        ["EndDateTime"] = eventData.GetProperty("endDateTime").GetString(),
        ["Image"] = eventData.GetProperty("image").GetString(),
        ["ImageAlt"] = eventData.GetProperty("imageAlt").GetString(),
      };

      try
      {
        await client.AddEntityAsync(newEvent);
      }
      catch (Exception ex)
      {
        log.LogError($"Could not insert new event: {ex.Message}");
        var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
        await errorResponse.WriteStringAsync("Error creating the event.");
        return errorResponse;
      }

      var responseEntity = new
      {
        id = newEvent.RowKey,
        title = newEvent["Title"],
        longDescription = newEvent["LongDescription"],
        shortDescription = newEvent["ShortDescription"],
        locationStreet = newEvent["LocationStreet"],
        locationCity = newEvent["LocationCity"],
        locationCountry = newEvent["LocationCountry"],
        creatorUserId = newEvent["CreatorUserID"],
        startDateTime = newEvent["StartDateTime"],
        endDateTime = newEvent["EndDateTime"],
        image = newEvent["Image"],
        imageAlt = newEvent["ImageAlt"],
      };

      var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
      await okResponse.WriteAsJsonAsync(responseEntity);
      return okResponse;
    }
  }
}
