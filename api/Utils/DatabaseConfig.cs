namespace B3.Complete.Eventwebb
{
    public class DatabaseConfig
    {
        public static string ConnectionString =>
        Constants.DatabaseConnectionString;

        public static string EventTable => Constants.EventTableName;
        public static string UserTable => Constants.UserTableName;
        public static string EventRegistrationTable => Constants.EventRegistrationTableName;
    }
}
