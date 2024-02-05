using System;
using System.Collections.Generic;
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
      [HttpTrigger(AuthorizationLevel.Function, "get", Route = "events")] HttpRequest req,
      ILogger log
    )
    {
      // Log information about the retrieval of all events
      log.LogInformation("Retrieving all events.");

      // Initialize a TableClient to interact with Azure Table Storage
      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
      var events = new List<EventEntity>();

      try
      {
        // Retrieve all entities in the table using asynchronous streaming
        await foreach (var entity in client.QueryAsync<EventEntity>())
        {
          events.Add(entity);
        }

        // Return a successful response with the list of events
        return new OkObjectResult(events);
      }
      catch (Exception ex)
      {
        // Log an error message if the retrieval fails and return a bad request response
        log.LogError($"Could not retrieve events: {ex.Message}");
        return new BadRequestObjectResult("Error retrieving events.");
      }
    }
  }
}
