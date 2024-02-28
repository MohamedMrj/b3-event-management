namespace B3.Complete.Eventwebb
{
    public static class Constants
    {
        // Connection strings
        public const string DatabaseConnectionString = "DefaultEndpointsProtocol=https;AccountName=b3eventwebbstorage;AccountKey=URmuupob95237E59Gg4dUKCdIo6dYp9w/hgT4Ras/0FsDK4b82RB+JD1oPYi6dPJV5lhIHdVZFHh+ASta2XhWw==;EndpointSuffix=core.windows.net";

        // Table names
        public const string EventTableName = "Events";
        public const string UserTableName = "Users";
        public const string EventRegistrationTableName = "EventRegistrations";

        // Secret keys
        public const string JwtSecretKey = "ZczdEdVxhn78Y3dF7v67HfzhVT8fzDF6ddGT4UeTC6zRK9gL7Kxrt6VMogqmCwQw";
    }
}
