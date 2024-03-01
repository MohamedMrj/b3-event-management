using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Azure.Communication.Email;

namespace B3.Complete.Eventwebb
{
    public static class Message
    {
        [FunctionName("Message")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            string email = data?.email; // Extract email from the request body

            if (string.IsNullOrEmpty(email))
            {
                return new BadRequestObjectResult("Please pass an email in the request body.");
            }

            string subject = "You're Invited to Our Event!";
            string eventLink = "http://linktoyourevent.com";
            string body = $"You have been invited to our event! Please join us at {eventLink}.";

            await SendMail(email, subject, body);

            string responseMessage = "The invitation email has been sent successfully.";

            return new OkObjectResult(responseMessage);
        }

        public static async Task SendMail(string emailAddress, string subject, string body)
        {

            var emailClient = new EmailClient("<Your Communication Services resource connection string>");

            var emailContent = new EmailContent(subject)
            {
                PlainText = body
            };

            var emailRecipients = new EmailRecipients(new EmailAddress[] { new EmailAddress(emailAddress) });

            var emailMessage = new EmailMessage("<Your sender email>", emailContent, emailRecipients);

            // Send the email and store the response
            SendEmailResult sendResult = await emailClient.SendAsync(emailMessage);

            // Log the message identifier for tracking purposes
            log.LogInformation($"Sent message with message id: {sendResult.MessageId}");
        }
    }
}
