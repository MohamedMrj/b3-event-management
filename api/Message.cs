// using Azure.Communication.Email;
// using Microsoft.Extensions.Logging;
// using Microsoft.Azure.Functions.Worker;
// using Microsoft.Azure.Functions.Worker.Http;
// using System.Threading.Tasks;
// using System.IO;
// using System.Text.Json;

// namespace B3.Complete.Eventwebb
// {
//     public static class Message
//     {
//         [Function(nameof(Message))]
//         public static async Task<HttpResponseData> Run(
//             [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequestData req,
//             FunctionContext executionContext)
//         {
//             var log = executionContext.GetLogger(nameof(Message));
//             log.LogInformation("Processing a new message request");

//             string senderEmail, recipientEmail, name;
//             try
//             {
//                 var data = await JsonSerializer.DeserializeAsync<dynamic>(req.Body);
//                 name = data?.name;
//                 senderEmail = data?.senderEmail;
//                 recipientEmail = data?.recipientEmail;

//                 if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(recipientEmail))
//                 {
//                     var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
//                     await badRequestResponse.WriteStringAsync("Request body is empty or invalid.");
//                     return badRequestResponse;
//                 }
//             }
//             catch (JsonException ex)
//             {
//                 log.LogError($"JSON parsing error: {ex.Message}");
//                 var badRequestResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
//                 await badRequestResponse.WriteStringAsync("Invalid JSON format.");
//                 return badRequestResponse;
//             }

//             try
//             {
//                 await SendMail(name, senderEmail, recipientEmail);
//             }
//             catch (Exception ex)
//             {
//                 log.LogError($"Error sending email: {ex.Message}");
//                 var errorResponse = req.CreateResponse(System.Net.HttpStatusCode.InternalServerError);
//                 await errorResponse.WriteStringAsync("Error sending the email.");
//                 return errorResponse;
//             }

//             var okResponse = req.CreateResponse(System.Net.HttpStatusCode.OK);
//             await okResponse.WriteStringAsync($"Hello, {name}. This HTTP triggered function executed successfully.");
//             return okResponse;
//         }

//         public static async Task SendMail(string name, string senderEmail, string recipientEmail)
//         {
//             var endpoint = "https://b3eventwebbcommservice.europe.communication.azure.com/";
//             var accessKey = "7axz1Tyjtw9vpis0Rt9sPcHSnnctbRJ34kE5UBWGT8+4eBJehi7fgIJHgTAjRkuClhIkneW1tS4I0HxkH1sgFw==";
//             var connectionString = $"endpoint={endpoint};accesskey={accessKey}";
//             var emailClient = new EmailClient(connectionString);
//             var emailContent = new EmailContent($"Hello, {name}!")
//             {
//                 PlainText = "This is an invitation sent by Mohamed"
//             };

//             var from = new EmailAddress(senderEmail);
//             var to = new EmailAddress(recipientEmail);
//             var emailMessage = new EmailMessage(from.Address, to.Address, emailContent);
//             await emailClient.SendEmailAsync(emailMessage);
//         }
//     }
// }