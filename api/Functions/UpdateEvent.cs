using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class UpdateEvent
    {
        [Function(nameof(UpdateEvent))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "event/{id}")] HttpRequestData req,
            string id,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("UpdateEvent");
            log.LogInformation($"Updating event with ID: {id}");

            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            JsonElement updatedEventData;
            try
            {
                updatedEventData = JsonSerializer.Deserialize<JsonElement>(requestBody);
            }
            catch (JsonException ex)
            {
                log.LogError($"Error parsing request body: {ex.Message}");
                var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid JSON format.");
                return badRequestResponse;
            }

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.EventTable);
            var queryResults = client.QueryAsync<TableEntity>(filter: $"RowKey eq '{id}'");

            await foreach (var entity in queryResults)
            {
                UpdateEntityProperties(entity, updatedEventData);
                try
                {
                    await client.UpdateEntityAsync(entity, Azure.ETag.All, TableUpdateMode.Merge);
                }
                catch (Exception ex)
                {
                    log.LogError($"Could not update event: {ex.Message}");
                    var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                    await errorResponse.WriteStringAsync("Error updating the event.");
                    return errorResponse;
                }
                var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
                await okResponse.WriteAsJsonAsync(new { message = "Event updated successfully." });
                return okResponse;
            }

            var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
            await notFoundResponse.WriteStringAsync("Event not found.");
            return notFoundResponse;
        }

        private static void UpdateEntityProperties(TableEntity entity, JsonElement updatedData)
        {
            foreach (var prop in updatedData.EnumerateObject())
            {
                switch (prop.Name.ToLowerInvariant())
                {
                    case "title":
                        entity["Title"] = prop.Value.GetString();
                        break;
                    case "longdescription":
                        entity["LongDescription"] = prop.Value.GetString();
                        break;
                    case "shortdescription":
                        entity["ShortDescription"] = prop.Value.GetString();
                        break;
                    case "locationstreet":
                        entity["LocationStreet"] = prop.Value.GetString();
                        break;
                    case "locationcity":
                        entity["LocationCity"] = prop.Value.GetString();
                        break;
                    case "locationcountry":
                        entity["LocationCountry"] = prop.Value.GetString();
                        break;
                    case "creatoruserid":
                        entity["CreatorUserId"] = prop.Value.GetString();
                        break;
                    case "startdatetime":
                        entity["StartDateTime"] = prop.Value.GetString();
                        break;
                    case "enddatetime":
                        entity["EndDateTime"] = prop.Value.GetString();
                        break;
                    case "image":
                        entity["Image"] = prop.Value.GetString();
                        break;
                    case "imagealt":
                        entity["ImageAlt"] = prop.Value.GetString();
                        break;
                }
            }
        }
    }
}
