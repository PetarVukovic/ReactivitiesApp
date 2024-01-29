using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{

    //This class is used to follow and unfollow users
    public class FollowToggle
    {
        //Command is used to update the database
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //First get our users
                var observer = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var target = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return null;

                //Now get the user following
                var following = await _dataContext.UserFollowings.FindAsync(observer.Id, target.Id);

                //If the user is already following the target, then unfollow them

                if (following != null)
                {
                    _dataContext.UserFollowings.Remove(following);

                }
                else
                {
                    //If the user is not following the target, then follow them
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _dataContext.UserFollowings.Add(following);
                }

                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");

            }

        }

    }
}