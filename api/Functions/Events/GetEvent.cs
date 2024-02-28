using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public static class GetEvent
    {
        [Function(nameof(GetEvent))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "event/{id}")] HttpRequestData req,
            string id,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetEvent));
            log.LogInformation($"Getting event with ID: {id}");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var filter = $"RowKey eq '{id}'";
            var queryResults = client.QueryAsync<EventEntity>(filter: filter);

            EventEntity? eventEntity = null;
            await foreach (var entity in queryResults)
            {
                eventEntity = entity;
                break;
            }

            if (eventEntity == null)
            {
                var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("Event not found.");
                return notFoundResponse;
            }

            var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
            await okResponse.WriteAsJsonAsync(eventEntity);

            return okResponse;
        }
    }
}
