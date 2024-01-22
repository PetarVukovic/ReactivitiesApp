using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;


/*UpdateAttendance.
We'll call this update attendance, even though it's going to have three different purposes.
If it's a user that's just going to an event, they're not a host and we hit this handler, it's going
to remove them from the activity.
If they're not going to the event, then it's going to join them to the activity.
And if they're the host, then it's going to cancel the activity.
That's what we're going to do inside this particular handler.
*/
public class UpdateAttendance
{

    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;

        }
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.Include(x => x.Attendees).ThenInclude(u => u.AppUser)
            .SingleOrDefaultAsync(x => x.Id == request.Id);

            if (activity == null) return null;

            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            if (user == null) return null;

            /*So what we'll also do for convenience is we'll just populate the host username of the activity in a variable.
            This is not an async method because we've already got the activity as well as the attendees in memory
             at this stage from this method.
             hostUsrerName is a string variable that we're going to use to store the host username.
              retrieves the username of the host of the activity. It does this by finding the first attendee of the activity where IsHost is true, 
              and then accessing the UserName property of the AppUser of that attendee.
            */

            var hostUsrerName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

            //And what we'll do then is we'll get the attendance status for this particular user.

            var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

            //And then we can add the logic to decide what we're going to do based on the attendance and the host username.

            if (attendance != null && hostUsrerName == user.UserName)
            {
                activity.IsCancelled = !activity.IsCancelled;
            }

            //And the host username is not equal to the user username.
            //This means they're just a normal attendee and what we're going to do is remove them from the attendeeslist.

            if (attendance != null && hostUsrerName != user.UserName)
            {
                activity.Attendees.Remove(attendance);
            }

            if (attendance == null)
            {
                attendance = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = false
                };

                activity.Attendees.Add(attendance);
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to update attendance");

            return Result<Unit>.Success(Unit.Value);








        }
    }








}