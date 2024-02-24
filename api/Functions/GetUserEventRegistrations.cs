using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public static class GetUserEventRegistrations
    {
        [Function(nameof(GetUserEventRegistrations))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/{userId}/registrations")] HttpRequestData req,
            string userId,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetUserEventRegistrations));
            log.LogInformation("Getting all event registrations for user.");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventRegistrationTable);

            var registrationList = new List<EventRegistrationEntity>();
            var filter = $"RowKey eq '{userId}'";
            var queryResults = client.QueryAsync<EventRegistrationEntity>(filter: filter);

            await foreach (var entity in queryResults)
            {
                registrationList.Add(entity);
            }

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            if (registrationList.Count > 0)
            {
                await response.WriteAsJsonAsync(registrationList);
            }
            else
            {
                response.StatusCode = System.Net.HttpStatusCode.NotFound;
                await response.WriteStringAsync("No events found.");
            }

            return response;
        }
    }
}
