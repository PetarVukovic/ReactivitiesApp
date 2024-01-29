using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }//This proeprty will be either followers or following

            public string Username { get; set; }//THis property will be the username of the user that we are looking for
        }


        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();
                //We need to return the list of profiles that the user is following based on the predicate which is either followers or following



                //But the idea is that obviously one case is going to return the followers and the other case is going
                //to return the users that are following that target user.
                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _dataContext.UserFollowings.Where(x => x.Target.UserName == request.Username)
                        .Select(u => u.Observer).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessor.GetCurrentUsername() }).ToListAsync();
                        break;
                    case "following":
                        profiles = await _dataContext.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                        .Select(u => u.Target).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessor.GetCurrentUsername() }).ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }




        }
    }
}