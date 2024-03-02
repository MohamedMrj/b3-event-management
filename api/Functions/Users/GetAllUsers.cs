using Azure.Data.Tables;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace B3.Complete.Eventwebb
{
    public static class GetAllUsers
    {
        [Function(nameof(GetAllUsers))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("GetAllUsers");
            log.LogInformation("Getting all users");

            var client = new TableClient(DatabaseConfig.ConnectionString, DatabaseConfig.UserTable);
            var queryResults = client.QueryAsync<TableEntity>();

            var users = new List<UserInfoDTO>();

            await foreach (var entity in queryResults)
            {
                var userInfo = new UserInfoDTO
                {
                    RowKey = entity.RowKey ?? string.Empty,
                    Username = entity.ContainsKey("Username") ? entity["Username"]?.ToString() ?? string.Empty : string.Empty,
                    FirstName = entity.ContainsKey("FirstName") ? entity["FirstName"]?.ToString() ?? string.Empty : string.Empty,
                    LastName = entity.ContainsKey("LastName") ? entity["LastName"]?.ToString() ?? string.Empty : string.Empty,
                    PhoneNumber = entity.ContainsKey("PhoneNumber") ? entity["PhoneNumber"]?.ToString() ?? string.Empty : string.Empty,
                    Avatar = entity.ContainsKey("Avatar") ? entity["Avatar"]?.ToString() ?? string.Empty : string.Empty,
                    UserType = entity.ContainsKey("UserType") ? entity["UserType"]?.ToString() ?? string.Empty : string.Empty,
                    Timestamp = entity.Timestamp ?? default,
                };

                users.Add(userInfo);
            }

            if (users.Count > 0)
            {
                var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
                await okResponse.WriteAsJsonAsync(users);
                return okResponse;
            }
            else
            {
                var notFoundResponse = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
                await notFoundResponse.WriteStringAsync("No users found.");
                return notFoundResponse;
            }
        }
    }
}
