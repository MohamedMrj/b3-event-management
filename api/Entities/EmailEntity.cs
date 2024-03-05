public class EmailEntity
{
    public string? Recipient { get; set; } = string.Empty;
    public string? Subject { get; set; } = string.Empty;
    public string? HtmlContent { get; set; } = string.Empty;
    public EmailAttachment? Attachment { get; set; }
    public List<EmailAttachment> Attachments { get; set; } = new List<EmailAttachment>();
}

public class EmailAttachment
{
    public EmailAttachment(string name, string contentType, string content)
    {
        Name = name;
        ContentType = contentType;
        Content = content;
    }

    public string Name { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
