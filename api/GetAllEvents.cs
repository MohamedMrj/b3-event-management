using Azure.Data.Tables;
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
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            // Initialize connection to the table storage
            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);
            var queryResults = client.QueryAsync<TableEntity>();

            // List to hold all events
            var eventsList = new List<object>();

            // Iterate through the results and transform each entity to a desired format
            await foreach (var entity in queryResults)
            {
                var transformedEventData = TransformEntityToEvent(entity);
                eventsList.Add(transformedEventData);
            }

            // Return the list of events; if no events found, return a NotFound result
            return eventsList.Count > 0 ? new OkObjectResult(eventsList) : new NotFoundResult();
        }

        private static object TransformEntityToEvent(TableEntity entity)
        {
            // Transform each TableEntity to a more friendly object for the response
            return new
            {
                id = entity.RowKey,
                title = entity["Title"],
                longDescription = entity["LongDescription"],
                shortDescription = entity["ShortDescription"],
                locationStreet = entity["LocationStreet"],
                locationCity = entity["LocationCity"],
                locationCountry = entity["LocationCountry"],
                creatorUserId = entity["CreatorUserID"],
                startDateTime = entity["StartDateTime"].ToString(),
                endDateTime = entity["EndDateTime"].ToString(),
                image = entity["Image"],
                imageAlt = entity["ImageAlt"],
            };
        }
    }
}
