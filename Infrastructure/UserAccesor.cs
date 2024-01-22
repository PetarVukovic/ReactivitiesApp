using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure;

public class UserAccesor : IUserAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserAccesor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public string GetCurrentUsername()
    {

        var username = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

        return username;

    }
}
