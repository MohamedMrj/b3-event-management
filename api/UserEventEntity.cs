using Azure;
using Azure.Data.Tables;
using System;

namespace B3.Complete.Eventwebb
{
    public class UserEventEntity : ITableEntity
    {
        public string PartitionKey { get; set; } // UserID
        public string RowKey { get; set; } // EventID
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }

        public bool IsHost { get; set; }
        public DateTime EventStartTime { get; set; }
        public string EventTitle { get; set; }
    }
}
