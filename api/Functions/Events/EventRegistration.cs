using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class EventRegistration
    {
        [Function(nameof(EventRegistration))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "event/{eventId}/registrations/{userId}")] HttpRequestData req,
            string eventId,
            string userId,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("EventRegistration");
            log.LogInformation("Creating a new event registration.");

            EventRegistrationEntity? registration;
            try
            {
                registration = await JsonSerializer.DeserializeAsync<EventRegistrationEntity>(req.Body);

                if (registration == null)
                {
                    var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteStringAsync("Request body is empty or invalid.");
                    return badRequestResponse;
                }

                registration.PartitionKey = eventId;
                registration.RowKey = userId;
            }
            catch (JsonException ex)
            {
                log.LogError($"JSON parsing error: {ex.Message}");
                var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid JSON format.");
                return badRequestResponse;
            }

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventRegistrationTable);

            try
            {
                await client.UpsertEntityAsync(registration, TableUpdateMode.Replace);
            }
            catch (Exception ex)
            {
                log.LogError($"Could not insert or update registration: {ex.Message}");
                var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Error creating or updating the event registration.");
                return errorResponse;
            }

            var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await okResponse.WriteAsJsonAsync(registration);
            return okResponse;
        }
    }
}
