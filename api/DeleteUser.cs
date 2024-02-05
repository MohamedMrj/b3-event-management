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
  public static class DeleteUser
  {
    [FunctionName("DeleteUser")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "user/{userType}/{userId}")]
        HttpRequest req,
      string userType,
      string userId,
      ILogger log
    )
    {
      // Log information about the attempted user deletion
      log.LogInformation($"Attempting to delete user: {userId}");

      // Initialize a TableClient to interact with Azure Table Storage
      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);

      try
      {
        // Attempt to delete the entity from Azure Table Storage
        await client.DeleteEntityAsync(userType, userId);

        // Return a successful response if the deletion is successful
        return new OkObjectResult($"User {userId} deleted successfully.");
      }
      catch (Exception ex)
      {
        // Log an error message if the deletion fails and return a bad request response
        log.LogError($"Could not delete user: {ex.Message}");
        return new BadRequestObjectResult("Error deleting the user.");
      }
    }
  }
}
