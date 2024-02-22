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
            log.LogInformation($"Getting all events.");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<TableEntity>();

            var eventsList = new List<object>();

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
