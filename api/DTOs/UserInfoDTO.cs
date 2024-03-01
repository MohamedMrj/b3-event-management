using System.Text.Json.Serialization;

public class UserInfoDTO
{
    [JsonPropertyName("userType")]
    public string UserType { get; set; } = string.Empty;

    [JsonPropertyName("id")]
    public string RowKey { get; set; } = string.Empty;

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = string.Empty;

    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = string.Empty;

    [JsonPropertyName("phoneNumber")]
    public string PhoneNumber { get; set; } = string.Empty;
}
