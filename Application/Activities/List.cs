using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    /*MediatR je biblioteka koja nam omogućava da izvršimo komunikaciju između naših različitih slojeva.
    Ovo se nalazi unutar app projekta.Trebamo vratiti te informacije u API treba ih povezati.
    Povezujemo ih preko mediatora.
    */
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            /*cancellationToken je token koji se koristi za otkazivanje operacije.
            */
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {


                var activities = await _context.Activities.
                ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                new { currentUsername = _userAccessor.GetCurrentUsername() }).ToListAsync();

                return Result<List<ActivityDto>>.Success(activities);
            }

        }
    }
}