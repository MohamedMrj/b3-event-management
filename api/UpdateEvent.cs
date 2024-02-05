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
      [HttpTrigger(AuthorizationLevel.Function, "put", Route = "event/{yearMonth}/{eventId}")]
        HttpRequest req,
      string yearMonth,
      string eventId,
      ILogger log
    )
    {
      log.LogInformation($"Updating event: {eventId} in {yearMonth}.");

      var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var updatedEventData = JsonSerializer.Deserialize<EventEntity>(requestBody);

      if (updatedEventData == null)
      {
        return new BadRequestObjectResult("Invalid event data.");
      }

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

      try
      {
        // Fetch the existing event entity to update
        var response = await client.GetEntityAsync<EventEntity>(yearMonth, eventId);
        var existingEvent = response.Value;

        // Update the existing event entity with new values
        existingEvent.Title = updatedEventData.Title ?? existingEvent.Title;
        existingEvent.LongDescription =
          updatedEventData.LongDescription ?? existingEvent.LongDescription;
        // ... and so on for each updatable field

        // Replace the existing event entity with the updated one
        await client.UpdateEntityAsync(existingEvent, existingEvent.ETag, TableUpdateMode.Replace);

        return new OkObjectResult(existingEvent);
      }
      catch (Exception ex)
      {
        log.LogError($"Could not update event: {ex.Message}");
        return new BadRequestObjectResult("Error updating the event.");
      }
    }
  }
}
