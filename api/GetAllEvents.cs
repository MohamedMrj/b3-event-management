using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace B3.Complete.Eventwebb
{
    public static class GetAllEvents
    {
        [FunctionName("GetAllEvents")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            
            // Proceed with the function logic
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


        // Validerings kod för token som lirar lokalt men ej via azure

              //Retrieve the JWT token from the request headers
         /*   if (!req.Headers.TryGetValue("Authorization", out var token))
            {
                log.LogError("Authorization token not found in request headers.");
                return new UnauthorizedResult();
            }


            // Validate the JWT token
            if (!ValidateToken(token, out var claims))
            {
                return new UnauthorizedResult();
            } 
    

       /* private static bool ValidateToken(string token, out ClaimsPrincipal claims)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    // Set your token validation parameters (issuer, audience, etc.)
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = "your_issuer",
                    ValidAudience = "your_audience",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_new_key_with_at_least_128_bits"))
                };

                claims = tokenHandler.ValidateToken(token.Replace("Bearer ", ""), validationParameters, out _);
                return true;
            }
            catch (Exception ex)
            {
                claims = null;
                return false;
            }
            */
        }
    }
