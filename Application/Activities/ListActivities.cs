using Application.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }


        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                var queryable = _context.ActivityAttendees.Where(u => u.AppUser.UserName == request.Username)
                .OrderBy(a => a.Activity.Date).ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(x => x.Date <= DateTime.UtcNow);
                        break;
                    case "hosting":
                        queryable = queryable.Where(x => x.HostUsername == request.Username);
                        break;
                    default:
                        queryable = queryable.Where(x => x.Date >= DateTime.UtcNow);
                        break;
                }

                var activities = await queryable.ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }

    }
}