using Azure;
using Azure.Data.Tables;
using System;

namespace B3.Complete.Eventwebb
{
    public class EventEntity : ITableEntity
    {
        public string PartitionKey { get; set; } // YearMonth
        public string RowKey { get; set; } // EventID
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public string CreatorUserId { get; set; }
        public string ImageURL { get; set; }
        public bool IsPublic { get; set; }
    }
}
