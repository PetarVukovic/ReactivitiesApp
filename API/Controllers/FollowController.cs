using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        //This method is used to follow and unfollow users.username is the target user which we want to follow
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUsername = username }));
        }

        //username and predicate are the parameters that we are going to pass in the url and get from query string
        //Username is going to come from root param and other from query string
        //{{url}}/api/follow/bob?predicate=following
        //Respnse:    {
        //     "username": "tom",
        //     "displayName": "Tom",
        //     "bio": null,
        //     "image": "https://res.cloudinary.com/dzq6adjxk/image/upload/v1706174326/n84zxha22xbudiedtmh9.jpg",
        //     "following": false,
        //     "followersCount": 1,
        //     "followingCount": 0,
        //     "photos": [
        //         {
        //             "id": "n84zxha22xbudiedtmh9",
        //             "url": "https://res.cloudinary.com/dzq6adjxk/image/upload/v1706174326/n84zxha22xbudiedtmh9.jpg",
        //             "isMain": true,
        //             "publicId": null
        //         }
        //     ]
        // }
        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new List.Query { Username = username, Predicate = predicate }));
        }
    }
}