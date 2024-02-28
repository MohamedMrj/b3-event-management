using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public static class GetEventsByCreator
    {
        [Function(nameof(GetEventsByCreator))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "events/creator/{creatorUserId}")] HttpRequestData req,
            string creatorUserId,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetEventsByCreator));
            log.LogInformation($"Getting events created by User ID: {creatorUserId}");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

            var eventsList = new List<EventEntity>();
            var filter = $"CreatorUserId eq '{creatorUserId}'";
            var queryResults = client.QueryAsync<EventEntity>(filter: filter);

            await foreach (var entity in queryResults)
            {
                eventsList.Add(entity);
            }

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await response.WriteAsJsonAsync(eventsList);

            return response;
        }
    }
}
