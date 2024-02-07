using Azure;
using Azure.Data.Tables;
using System;

namespace B3.Complete.Eventwebb
{
    public class UserEntity : ITableEntity
    {
        public string PartitionKey { get; set; } // UserType
        public string RowKey { get; set; } // UserID
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsAdmin { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
