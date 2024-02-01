using System;
using System.ComponentModel.DataAnnotations;

public class User
{
    public Guid UserID { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Phone]
    public string PhoneNumber { get; set; }

    public UserRole Role { get; set; } = UserRole.NormalUser; // Default role
}
