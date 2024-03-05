using System.Text;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;

namespace B3.Complete.Eventwebb
{
    public static class CalendarFunction
    {
        [Function(nameof(CalendarFunction))]
        public static async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "calendar")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/calendar; charset=utf-8");
            response.Headers.Add("Content-Disposition", "inline; filename=\"event.ics\"");

            var calendarContent = new StringBuilder();
            calendarContent.AppendLine("BEGIN:VCALENDAR");
            calendarContent.AppendLine("VERSION:2.0");
            calendarContent.AppendLine("PRODID:-//hacksw/handcal//NONSGML v1.0//EN");
            calendarContent.AppendLine("BEGIN:VEVENT");
            calendarContent.AppendLine($"DTSTAMP:{DateTime.UtcNow:yyyyMMddTHHmmssZ}");
            calendarContent.AppendLine($"DTSTART:{DateTime.UtcNow.AddDays(1):yyyyMMddTHHmmssZ}");
            calendarContent.AppendLine($"DTEND:{DateTime.UtcNow.AddDays(1).AddHours(1):yyyyMMddTHHmmssZ}");
            calendarContent.AppendLine("SUMMARY:Test Event");
            calendarContent.AppendLine("END:VEVENT");
            calendarContent.AppendLine("END:VCALENDAR");

            await response.WriteStringAsync(calendarContent.ToString());

            return response;
        }
    }
}


// Testas mot http://localhost:7071/api/calendar om den skapar fil .ics fil
