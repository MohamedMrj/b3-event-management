namespace EventManagementApi.Models
{
    public class Event
    {
        public Guid EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public string CreatorUserId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPublic { get; set; }
    }
}
