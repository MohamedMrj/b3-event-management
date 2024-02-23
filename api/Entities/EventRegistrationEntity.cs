using Azure;
using Azure.Data.Tables;
using System;
using System.Text.Json.Serialization;

public class EventRegistrationEntity : ITableEntity
{
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    [JsonPropertyName("eventId")]
    public string PartitionKey { get; set; } = string.Empty;

    [JsonPropertyName("userId")]
    public string RowKey { get; set; } = string.Empty;

    [JsonPropertyName("registrationStatus")]
    public string RegistrationStatus { get; set; } = string.Empty;
}
