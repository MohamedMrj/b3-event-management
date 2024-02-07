using Azure;
using Azure.Data.Tables;
using System;

namespace B3.Complete.Eventwebb
{
    public class EventResponseEntity : ITableEntity
    {
        public string PartitionKey { get; set; } // EventID
        public string RowKey { get; set; } // UserID
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }

        public string AttendanceStatus { get; set; }
        public DateTime ResponseTime { get; set; }
    }
}
