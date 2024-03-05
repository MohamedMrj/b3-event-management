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

            var endpoint = "https://b3eventwebbcommservice.europe.communication.azure.com/";
            var accessKey = "7axz1Tyjtw9vpis0Rt9sPcHSnnctbRJ34kE5UBWGT8+4eBJehi7fgIJHgTAjRkuClhIkneW1tS4I0HxkH1sgFw==";

            var connectionString = $"endpoint={endpoint};accesskey={accessKey}";
            var emailClient = new EmailClient(connectionString);

            var sender = "B3EventWeb@73808b03-f7d2-482d-a917-8b397989c0ee.azurecomm.net";
            var recipient = "h21sebda@du.se";
            var subject = "Send email quick start - dotnet";
            var htmlContent = "<html><body><h1>Quick send email test</h1><br/><h4>Communication email as a service mail send app working properly</h4><p>Happy Learning!!</p></body></html>";

            try
            {
                var emailSendOperation = await emailClient.SendAsync(
                    wait: WaitUntil.Completed,
                    senderAddress: sender, // The email address of the domain registered with the Communication Services resource
                    recipientAddress: recipient,
                    subject: subject,
                    htmlContent: htmlContent);
                Console.WriteLine($"Email Sent. Status = {emailSendOperation.Value.Status}");

                /// Get the OperationId so that it can be used for tracking the message for troubleshooting
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
                /// OperationID is contained in the exception message and can be used for troubleshooting purposes
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
