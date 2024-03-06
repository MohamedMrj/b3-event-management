using Azure;
using Azure.Communication.Email;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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

            // Set up the connection to the Azure Communication Services resource
            var endpoint = "https://b3eventwebbcommservice.europe.communication.azure.com/";
            var accessKey = "7axz1Tyjtw9vpis0Rt9sPcHSnnctbRJ34kE5UBWGT8+4eBJehi7fgIJHgTAjRkuClhIkneW1tS4I0HxkH1sgFw==";
            var connectionString = $"endpoint={endpoint};accesskey={accessKey}";
            EmailClient emailClient = new EmailClient(connectionString);

            // Set up the sender address
            var sender = "B3EventWeb@73808b03-f7d2-482d-a917-8b397989c0ee.azurecomm.net";

            // Parse the request body
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

            // Create the email content
            var emailContent = new EmailContent(newEmail.Subject)
            {
                PlainText = newEmail.PlainTextContent,
                Html = newEmail.HtmlContent
            };

            // Create the EmailMessage
            var emailMessage = new EmailMessage(
                senderAddress: sender,
                recipientAddress: newEmail.Recipient,
                content: emailContent);

            // Create the EmailAttachment
            if (newEmail.Attachment != null)
            {
                // Convert from Base64 to binary
                var contentBinaryData = Convert.FromBase64String(newEmail.Attachment.Content);
                var binaryData = new BinaryData(contentBinaryData);
                var emailAttachment = new Azure.Communication.Email.EmailAttachment(
                    newEmail.Attachment.Name,
                    newEmail.Attachment.ContentType,
                    binaryData);
                emailMessage.Attachments.Add(emailAttachment);
            }

            // Send the email
            try
            {
                EmailSendOperation emailSendOperation = emailClient.Send(WaitUntil.Completed, emailMessage);
                Console.WriteLine($"Email Sent. Status = {emailSendOperation.Value.Status}");

                /// Get the OperationId so that it can be used for tracking the message for troubleshooting
                string operationId = emailSendOperation.Id;
                Console.WriteLine($"Email operation id = {operationId}");

                var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json");
                await response.WriteStringAsync(JsonSerializer.Serialize(new { message = "Email sent successfully." }));
                return response;
            }
            catch (RequestFailedException ex)
            {
                /// OperationID is contained in the exception message and can be used for troubleshooting purposes
                Console.WriteLine($"Email send operation failed with error code: {ex.ErrorCode}, message: {ex.Message}");

                var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Error sending the email.");
                return errorResponse;
            }
        }
    }
}
