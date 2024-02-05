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
  public static class CreateUser
  {
    [FunctionName("CreateUser")]
    public static async Task<IActionResult> Run(
      [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "user")] HttpRequest req,
      ILogger log
    )
    {
      var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
      var userData = JsonSerializer.Deserialize<UserEntity>(requestBody);

      if (userData == null)
      {
        return new BadRequestObjectResult("Invalid user data.");
      }

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);

      // Retrieve the highest RowKey value
      int maxRowKey = await GetMaxRowKey(client, log) + 1;

      // Set the PartitionKey and RowKey
      userData.PartitionKey = "user";
      userData.RowKey = maxRowKey.ToString();
      try
      {
        await client.AddEntityAsync(userData);
      }
      catch (Exception ex)
      {
        log.LogError($"Could not insert new user: {ex.Message}");
        return new BadRequestObjectResult("Error creating the user.");
      }

      // Return the created event data
      return new OkObjectResult(userData);
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
