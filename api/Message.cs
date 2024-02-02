using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
  public static class Event
  {
    // Denna sträng ska krypteras med Azure.Identity och läggas i Azure Key Vault efter testning
    private const string connectionString =
      "DefaultEndpointsProtocol=https;AccountName=b3eventwebbstorage;AccountKey=URmuupob95237E59Gg4dUKCdIo6dYp9w/hgT4Ras/0FsDK4b82RB+JD1oPYi6dPJV5lhIHdVZFHh+ASta2XhWw==;EndpointSuffix=core.windows.net";

    // Sätter vilket table som data ska hämtas från

    private const string tableName = "Events";

    [FunctionName("GetAllEvents")]
    public static async Task<IActionResult> GeAllEvents(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
      ILogger log
    )
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
      ILogger log
    )
    {
      var client = new TableClient(connectionString, tableName);

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

    [FunctionName("CreateEvent")]
    public static async Task<IActionResult> CreateEvent(
      [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "event")] HttpRequest req,
      ILogger log
    )
    {
      string connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
      string tableName = "Events"; // Replace with your table name

      var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var eventData = JsonSerializer.Deserialize<JsonElement>(requestBody);

      var client = new TableClient(connectionString, tableName);

      // Retrieve the highest RowKey value
      int maxRowKey = await GetMaxRowKey(client, log) + 1;

      var newEvent = new TableEntity
      {
        PartitionKey = DateTime.UtcNow.ToString("yyyyMM"),
        RowKey = maxRowKey.ToString(), // Use the next RowKey value
        ["Title"] = eventData.GetProperty("Title").GetString(),
        ["Description"] = eventData.GetProperty("Description").GetString(),
        ["Location"] = eventData.GetProperty("Location").GetString(),
        ["CreatorUserID"] = eventData.GetProperty("CreatorUserID").GetString(),
        ["ImageURL"] = eventData.GetProperty("ImageURL").GetString(),
        ["isPublic"] = eventData.GetProperty("isPublic").GetBoolean()
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

      return new OkObjectResult(newEvent);
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
