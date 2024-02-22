using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

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

      var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.TableName);

      // Directly use the id in the filter without parsing it
      var filter = $"RowKey eq '{id}'";
      var queryResults = client.QueryAsync<TableEntity>(filter: filter);

      TableEntity? eventEntity = null;
      await foreach (var entity in queryResults)
      {
        eventEntity = entity;
        break; // Break after getting the first result
      }

      if (eventEntity == null)
      {
        var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
        await notFoundResponse.WriteStringAsync("Event not found.");
        return notFoundResponse;
      }

      var transformedEventData = TransformEntityToEvent(eventEntity);

      var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
      await okResponse.WriteAsJsonAsync(transformedEventData);
      return okResponse;
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
