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
      var eventData = JsonSerializer.Deserialize<EventEntity>(requestBody);

      if (eventData == null)
      {
        return new BadRequestObjectResult("Invalid event data.");
      }

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

      // Retrieve the highest RowKey value
      int maxRowKey = await GetMaxRowKey(client, log) + 1;

      // Set the PartitionKey and RowKey
      eventData.PartitionKey = DateTime.UtcNow.ToString("yyyyMM");
      eventData.RowKey = maxRowKey.ToString();
      try
      {
        await client.AddEntityAsync(eventData);
      }
      catch (Exception ex)
      {
        log.LogError($"Could not insert new event: {ex.Message}");
        return new BadRequestObjectResult("Error creating the event.");
      }

      // Return the created event data
      return new OkObjectResult(eventData);
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
