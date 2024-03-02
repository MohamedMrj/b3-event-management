using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class GetAllEventRegistrations
    {
        [Function(nameof(GetAllEventRegistrations))]
        public static async Task<HttpResponseData> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "event/{eventId}/registrations")] HttpRequestData req,
    string eventId,
    FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("GetAllEventRegistrations");
            log.LogInformation($"Fetching all registrations for event {eventId}.");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventRegistrationTable);
            var userClient = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);
            var queryResults = client.QueryAsync<EventRegistrationEntity>(filter: $"PartitionKey eq '{eventId}'");

            var detailedRegistrations = new List<RegistrationWithUserDetails>();

            await foreach (var registration in queryResults)
            {
                var userEntity = await userClient.GetEntityAsync<TableEntity>("User", registration.RowKey);
                var registrationDetails = new RegistrationWithUserDetails
                {
                    Timestamp = registration.Timestamp.ToString(),
                    EventId = registration.PartitionKey,
                    UserId = registration.RowKey,
                    RegistrationStatus = registration.RegistrationStatus,
                    FirstName = userEntity?.Value.GetString("FirstName") ?? "",
                    LastName = userEntity?.Value.GetString("LastName") ?? "",
                    Username = userEntity?.Value.GetString("Username") ?? "",
                    Avatar = userEntity?.Value.GetString("Avatar") ?? "",
                };

                detailedRegistrations.Add(registrationDetails);
            }

            if (detailedRegistrations.Count == 0)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("No registrations found for the given event ID.");
                return notFoundResponse;
            }

            var okResponse = req.CreateResponse(HttpStatusCode.OK);
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            var json = JsonSerializer.Serialize(detailedRegistrations, options);
            okResponse.Headers.Add("Content-Type", "application/json; charset=utf-8");
            await okResponse.WriteStringAsync(json);
            return okResponse;
        }
    }
}
