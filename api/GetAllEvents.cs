using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace B3.Complete.Eventwebb
{
    public static class GetAllEvents
    {
        [Function(nameof(GetAllEvents))]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            // Directly proceed with fetching events without token validation
            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<TableEntity>();

            var eventsList = new List<object>();

            await foreach (var entity in queryResults)
            {
                var transformedEventData = TransformEntityToEvent(entity);
                eventsList.Add(transformedEventData);
            }

            return eventsList.Count > 0 ? new OkObjectResult(eventsList) : new NotFoundResult();
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
