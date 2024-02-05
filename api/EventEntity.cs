using System;
using Azure;
using Azure.Data.Tables;

namespace B3.Complete.Eventwebb
{
  public class EventEntity : ITableEntity
  {
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }

    public string Title { get; set; }
    public string LongDescription { get; set; }
    public string ShortDescription { get; set; }
    public string LocationStreet { get; set; }
    public string LocationCity { get; set; }
    public string LocationCountry { get; set; }
    public string CreatorUserID { get; set; }
    public string StartDateTime { get; set; }
    public string EndDateTime { get; set; }
    public string Timezone { get; set; }
    public string ImageUrl { get; set; }
    public string ImageAlt { get; set; }
  }
}
