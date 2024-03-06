using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Azure;

namespace B3.Complete.Eventwebb
{
    public static class GetUserEvents
    {
        [Function(nameof(GetUserEvents))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/{userId}/events")] HttpRequestData req,
            string userId,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetUserEvents));
            log.LogInformation("Getting all events for user.");

            var registrationsClient = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventRegistrationTable);
            var eventsClient = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

            // Query the registrations table for the given userId
            var filter = $"RowKey eq '{userId}' and RegistrationStatus ne 'Kommer inte'";
            var registrationQueryResults = registrationsClient.QueryAsync<EventRegistrationEntity>(filter: filter);

            var eventsList = new List<EventEntity>();

            // Assuming registrationQueryResults is of type AsyncPageable<EventRegistrationEntity>
            await foreach (var registration in registrationQueryResults)
            {
                // Use an asynchronous query to fetch event entities asynchronously
                var eventQueryResults = eventsClient.QueryAsync<EventEntity>(filter: $"RowKey eq '{registration.PartitionKey}'");

                await foreach (var eventEntity in eventQueryResults)
                {
                    eventsList.Add(eventEntity);
                }
            }


            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            if (eventsList.Count > 0)
            {
                await response.WriteAsJsonAsync(eventsList);
            }
            else if (eventsList.Count == 0)
            {
                await response.WriteAsJsonAsync(new List<EventEntity>());
            }
            else
            {
                response.StatusCode = System.Net.HttpStatusCode.NotFound;
                await response.WriteStringAsync("Something went wrong.");
            }

            return response;
        }
    }
}
