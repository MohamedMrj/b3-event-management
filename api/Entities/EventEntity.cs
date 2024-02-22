using Azure;
using Azure.Data.Tables;
using System;
using System.Text.Json.Serialization;

public class EventEntity : ITableEntity
{
    public string PartitionKey { get; set; } = string.Empty;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    [JsonPropertyName("id")]
    public string RowKey { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("longDescription")]
    public string LongDescription { get; set; } = string.Empty;

    [JsonPropertyName("shortDescription")]
    public string ShortDescription { get; set; } = string.Empty;

    [JsonPropertyName("locationStreet")]
    public string LocationStreet { get; set; } = string.Empty;

    [JsonPropertyName("locationCity")]
    public string LocationCity { get; set; } = string.Empty;

    [JsonPropertyName("locationCountry")]
    public string LocationCountry { get; set; } = string.Empty;

    [JsonPropertyName("creatorUserId")]
    public string CreatorUserId { get; set; } = string.Empty;

    [JsonPropertyName("startDateTime")]
    public DateTime StartDateTime { get; set; } = DateTime.MinValue;

    [JsonPropertyName("endDateTime")]
    public DateTime EndDateTime { get; set; } = DateTime.MinValue;

    [JsonPropertyName("image")]
    public string Image { get; set; } = string.Empty;

    [JsonPropertyName("imageAlt")]
    public string ImageAlt { get; set; } = string.Empty;
}
