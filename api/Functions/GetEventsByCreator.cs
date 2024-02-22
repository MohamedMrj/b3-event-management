using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public class GetEventsByCreator
    {
        [Function(nameof(GetEventsByCreator))]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "events/creator/{creatorUserId}")] HttpRequestData req,
            string creatorUserId,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(GetEventsByCreator));
            log.LogInformation($"Getting events created by User ID: {creatorUserId}");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);

            var eventsList = new List<object>();
            var filter = $"CreatorUserId eq '{creatorUserId}'";
            var queryResults = client.QueryAsync<TableEntity>(filter: filter);

            await foreach (var entity in queryResults)
            {
                var transformedEventData = TransformEntityToEvent(entity);
                eventsList.Add(transformedEventData);
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

        private static object TransformEntityToEvent(TableEntity entity)
        {
            return new
            {
                id = entity.RowKey,
                title = entity["Title"],
                longDescription = entity["LongDescription"],
                shortDescription = entity["ShortDescription"],
                locationStreet = entity["LocationStreet"],
                locationCity = entity["LocationCity"],
                locationCountry = entity["LocationCountry"],
                creatorUserId = entity["CreatorUserId"],
                startDateTime = entity["StartDateTime"].ToString(),
                endDateTime = entity["EndDateTime"].ToString(),
                image = entity["Image"],
                imageAlt = entity["ImageAlt"],
            };
        }
    }
}
