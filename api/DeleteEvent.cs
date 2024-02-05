using System;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
  public static class DeleteEvent
  {
    [FunctionName("DeleteEvent")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "event/{yearMonth}/{eventId}")]
        HttpRequest req,
      string yearMonth,
      string eventId,
      ILogger log
    )
    {
      // Log information about the attempted event deletion
      log.LogInformation($"Attempting to delete event: {eventId}");

      // Initialize a TableClient to interact with Azure Table Storage
      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

      try
      {
        // Attempt to delete the entity from Azure Table Storage
        await client.DeleteEntityAsync(yearMonth, eventId);

        // Return a successful response if the deletion is successful
        return new OkObjectResult($"Event {eventId} deleted successfully.");
      }
      catch (Exception ex)
      {
        // Log an error message if the deletion fails and return a bad request response
        log.LogError($"Could not delete event: {ex.Message}");
        return new BadRequestObjectResult("Error deleting the event.");
      }
    }
  }
}
