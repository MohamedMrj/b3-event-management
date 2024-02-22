using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public static class DeleteEvent
    {
        [Function(nameof(DeleteEvent))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "event/{id}")] HttpRequestData req,
            string id,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("DeleteEvent");
            log.LogInformation($"Deleting event with ID: {id}");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<TableEntity>(filter: $"RowKey eq '{id}'");

            await foreach (var entity in queryResults)
            {
                try
                {
                    await client.DeleteEntityAsync(entity.PartitionKey, entity.RowKey, Azure.ETag.All);
                    var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
                    await okResponse.WriteStringAsync($"Event with ID: {id} deleted successfully.");
                    return okResponse;
                }
                catch (Exception ex)
                {
                    log.LogError($"Could not delete event: {ex.Message}");
                    var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
                    await errorResponse.WriteStringAsync("Error deleting the event.");
                    return errorResponse;
                }
            }

            var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
            await notFoundResponse.WriteStringAsync("Event not found.");
            return notFoundResponse;
        }
    }
}
