using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class UpdateEvent
    {
        [Function(nameof(UpdateEvent))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "event/{id}")] HttpRequestData req,
            string id,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("UpdateEvent");
            log.LogInformation($"Updating event with ID: {id}");

            EventEntity? updatedEvent;
            try
            {
                updatedEvent = await JsonSerializer.DeserializeAsync<EventEntity>(req.Body);

                if (updatedEvent == null)
                {
                    var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteStringAsync("Request body is empty or invalid.");
                    return badRequestResponse;
                }
            }
            catch (JsonException ex)
            {
                log.LogError($"Error parsing request body: {ex.Message}");
                var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid JSON format.");
                return badRequestResponse;
            }

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<EventEntity>(filter: $"RowKey eq '{id}'");

            bool found = false;
            await foreach (var entity in queryResults)
            {
                found = true;
                updatedEvent.PartitionKey = entity.PartitionKey;
                updatedEvent.RowKey = entity.RowKey;

                try
                {
                    await client.UpdateEntityAsync(updatedEvent, Azure.ETag.All, TableUpdateMode.Replace);
                    var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
                    await okResponse.WriteAsJsonAsync(new { message = "Event updated successfully." });
                    return okResponse;
                }
                catch (Exception ex)
                {
                    log.LogError($"Could not update event: {ex.Message}");
                    var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                    await errorResponse.WriteStringAsync("Error updating the event.");
                    return errorResponse;
                }
            }

            if (!found)
            {
                var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Event not found.");
                return notFoundResponse;
            }

            var fallbackResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
            await fallbackResponse.WriteStringAsync("An unexpected error occurred.");
            return fallbackResponse;
        }
    }
}
