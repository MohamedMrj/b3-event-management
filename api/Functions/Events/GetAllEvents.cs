using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public static class GetAllEvents
    {
        [Function(nameof(GetAllEvents))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetAllEvents));
            log.LogInformation("Getting all events.");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<EventEntity>();

            var eventsList = new List<EventEntity>();

            await foreach (var entity in queryResults)
            {
                eventsList.Add(entity);
            }

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            if (eventsList.Count > 0)
            {
                await response.WriteAsJsonAsync(eventsList);
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
