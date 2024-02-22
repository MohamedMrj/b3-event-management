using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace B3.Complete.Eventwebb
{
    public static class GetUserInfo
    {
        [Function(nameof(GetUserInfo))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "user/{id}")] HttpRequestData req,
            string id,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("GetUserInfo");
            log.LogInformation($"Getting user with ID: {id}");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);
            var queryResults = client.QueryAsync<TableEntity>(filter: $"RowKey eq '{id}'");

            await foreach (var entity in queryResults)
            {
                var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
                await okResponse.WriteAsJsonAsync(new { id = entity.RowKey, username = entity["Username"] });
                return okResponse;
            }

            var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
            await notFoundResponse.WriteStringAsync("User not found.");
            return notFoundResponse;
        }
    }
}
