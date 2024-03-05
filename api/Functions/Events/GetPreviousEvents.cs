using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace B3.Complete.Eventwebb
{
    public static class GetPreviousEvents
    {
        [Function(nameof(GetPreviousEvents))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetPreviousEvents));
            log.LogInformation("Getting all previous events.");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<EventEntity>();

            var eventsList = new List<EventEntity>();

            await foreach (var entity in queryResults)
            {
                if (entity.EndDateTime < DateTime.Now)
                {
                    eventsList.Add(entity);
                }
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
