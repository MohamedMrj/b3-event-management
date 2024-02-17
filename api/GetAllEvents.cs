using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
    public static class GetAllEvents
    {
        [FunctionName("GetAllEvents")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            // Proceed with the function logic without token validation

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);
            var queryResults = client.QueryAsync<TableEntity>();

            var eventsList = new List<object>();

            await foreach (var entity in queryResults)
            {
                var transformedEventData = new
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

                eventsList.Add(transformedEventData);
            }

            if (eventsList.Count == 0)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(eventsList);
        }
    }
}