using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ObjectPool;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]// This is the route that will be used to access the profile of a specific user.
        public async Task<IActionResult> GetProfile(string username)
        {
            var a = username.Substring(0, username.Length - 1);
            return HandleResult(await Mediator.Send(new Details.Query { Username = a }));
        }

        [HttpPut]
        public async Task<IActionResult> Edit(Edit.Command command)// This Edit.Command object likely contains the data needed to update a user's profile.
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string predicate)// This is the route that will be used to access the profile of a specific user.
        {
            return HandleResult(await Mediator.Send(new Application.Activities.ListActivities.Query { Username = username, Predicate = predicate }));
        }

    }
}