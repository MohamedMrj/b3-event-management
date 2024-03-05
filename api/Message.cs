using Azure;
using Azure.Communication.Email;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Text.Json;

namespace B3.Complete.Eventwebb
{
    public static class Message
    {
        [Function(nameof(Message))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger(nameof(Message));
            log.LogInformation("Processing a new email sending request.");

            var sender = "B3EventWeb@73808b03-f7d2-482d-a917-8b397989c0ee.azurecomm.net";
            var endpoint = "https://b3eventwebbcommservice.europe.communication.azure.com/";
            var accessKey = "7axz1Tyjtw9vpis0Rt9sPcHSnnctbRJ34kE5UBWGT8+4eBJehi7fgIJHgTAjRkuClhIkneW1tS4I0HxkH1sgFw==";
            var connectionString = $"endpoint={endpoint};accesskey={accessKey}";
            var emailClient = new EmailClient(connectionString);

            EmailEntity? newEmail;

            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                };

                newEmail = await JsonSerializer.DeserializeAsync<EmailEntity>(req.Body, options);
                if (newEmail == null)
                {
                    var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                    await badRequestResponse.WriteStringAsync("Request body is empty or invalid.");
                    return badRequestResponse;
                }
            }
            catch (JsonException ex)
            {
                log.LogError($"JSON parsing error: {ex.Message}");
                var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badRequestResponse.WriteStringAsync("Invalid JSON format.");
                return badRequestResponse;
            }

            try
            {
                var emailSendOperation = await emailClient.SendAsync(
                    wait: WaitUntil.Completed,
                    senderAddress: sender,
                    recipientAddress: newEmail.Recipient,
                    subject: newEmail.Subject,
                    htmlContent: newEmail.HtmlContent);
                Console.WriteLine($"Email Sent. Status = {emailSendOperation.Value.Status}");

                string operationId = emailSendOperation.Id;
                Console.WriteLine($"Email operation id = {operationId}");

                var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json");

                var responseContent = new { message = "Email sent successfully." };
                await response.WriteStringAsync(JsonSerializer.Serialize(responseContent));

                return response;
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Email send operation failed with error code: {ex.ErrorCode}, message: {ex.Message}");
                var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "application/json");

                var errorContent = new { message = "Error sending the email." };
                await errorResponse.WriteStringAsync(JsonSerializer.Serialize(errorContent));

                return errorResponse;
            }
        }
    }
}
