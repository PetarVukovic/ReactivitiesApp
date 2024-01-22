using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {


    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {

        /*But what we're also going to need to do is get access to the route ID of the activity that we're trying
        to access because we need to get the activity ID so that we can check the attendees of that activity
        from our activity attendee Join table and see if this particular user is the host of that activity.
        */
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {

            /*And we're going to look for the name identifier because we want to use the user's ID in this case because
            our activity attendee table, its primary key is made up of a combination of our user ID and the activity
            ID, and our query is going to be more efficient as if we just try and find the activity. By its primary key.
            */
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
            .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            /*
            And when we're getting our attendee object from entity framework, this is tracking the entity that we're getting.
             And this stays in memory, even though our handler will have been disposed of because it's a transient,
             it doesn't mean that the entity that we've obtained from entity framework is also going to be disposed.
             This is staying in memory and it's causing a problem when we're editing an activity because we're only
             sending up the activity object.
             And in our edit class we're not getting the related entity and we've got an activity attendees object
            inside memory for that particular activity.
            Is that combination of things that is making our activity, our activity attendees disappear from the list.
            */

            var attendee = _dbContext.ActivityAttendees.AsNoTracking()
            .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId).Result;

            if (attendee == null) return Task.CompletedTask;

            //And if we return at this point and the context and the context succeed, flag is set, then the user would be authorized to go ahead and edit the activity.
            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}