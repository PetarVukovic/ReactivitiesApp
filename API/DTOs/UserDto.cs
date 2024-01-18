namespace API.DTOs
{
    public class UserDto
    {
        public string Username { get; set; }
        public string Token { get; set; } // JWT Token
        public string Image { get; set; }
        public string DisplayName { get; set; }

    }
}