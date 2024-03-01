using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class GetUserEventRegistration
    {
        [Function(nameof(GetUserEventRegistration))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/{userId}/registration/{eventId}")] HttpRequestData req,
            string userId,
            string eventId,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetUserEventRegistration));
            log.LogInformation("Getting event registration for user.");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventRegistrationTable);
            var filter = $"PartitionKey eq '{eventId}' and RowKey eq '{userId}'";
            var queryResults = client.QueryAsync<EventRegistrationEntity>(filter: filter);

            EventRegistrationEntity? registrationEntity = null;
            await foreach (var entity in queryResults)
            {
                registrationEntity = entity;
                break;
            }

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);

            if (registrationEntity != null)
            {
                await response.WriteAsJsonAsync(new { success = true, data = registrationEntity });
            }
            else
            {
                await response.WriteAsJsonAsync(new { success = false, message = "Event registration not found." });
            }

            return response;
        }
    }
}
