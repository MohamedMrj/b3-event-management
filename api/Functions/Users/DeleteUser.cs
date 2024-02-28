using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class DeleteUser
    {
        [Function(nameof(DeleteUser))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "users/{id}")] HttpRequestData req,
            string id,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("DeleteUser");
            log.LogInformation($"Deleting user with ID: {id}");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);
            var queryResults = client.QueryAsync<UserEntity>(filter: $"RowKey eq '{id}'");

            await foreach (var entity in queryResults)
            {
                try
                {
                    await client.DeleteEntityAsync(entity.PartitionKey, entity.RowKey, Azure.ETag.All);
                    var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
                    okResponse.Headers.Add("Content-Type", "application/json");

                    var responseContent = new { message = $"User with ID: {id} deleted successfully." };
                    await okResponse.WriteStringAsync(JsonSerializer.Serialize(responseContent));

                    return okResponse;
                }
                catch (Exception ex)
                {
                    log.LogError($"Could not delete user: {ex.Message}");
                    var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
                    errorResponse.Headers.Add("Content-Type", "application/json");

                    var errorContent = new { message = "Error deleting the user." };
                    await errorResponse.WriteStringAsync(JsonSerializer.Serialize(errorContent));

                    return errorResponse;
                }
            }

            var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
            notFoundResponse.Headers.Add("Content-Type", "application/json");

            var notFoundContent = new { message = "User not found." };
            await notFoundResponse.WriteStringAsync(JsonSerializer.Serialize(notFoundContent));

            return notFoundResponse;
        }
    }
}
