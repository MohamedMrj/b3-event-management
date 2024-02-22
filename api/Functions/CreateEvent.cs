using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class CreateEvent
    {
        [Function(nameof(CreateEvent))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "event")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("CreateEvent");
            log.LogInformation("Creating a new event");

            EventEntity? newEvent;
            try
            {
                newEvent = await JsonSerializer.DeserializeAsync<EventEntity>(req.Body);

                if (newEvent == null)
                {
                    var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteStringAsync("Request body is empty or invalid.");
                    return badRequestResponse;
                }

                newEvent.PartitionKey = DateTime.UtcNow.ToString("yyyyMM");
                newEvent.RowKey = Guid.NewGuid().ToString();
            }
            catch (JsonException ex)
            {
                log.LogError($"JSON parsing error: {ex.Message}");
                var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid JSON format.");
                return badRequestResponse;
            }

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

            try
            {
                await client.AddEntityAsync(newEvent);
            }
            catch (Exception ex)
            {
                log.LogError($"Could not insert new event: {ex.Message}");
                var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await errorResponse.WriteStringAsync("Error creating the event.");
                return errorResponse;
            }

            var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await okResponse.WriteAsJsonAsync(newEvent);
            return okResponse;
        }
    }
}
