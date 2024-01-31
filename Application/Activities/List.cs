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
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params { get; set; }

        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
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
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                //AsQueryable() je metoda koja vraća IQueryable<T> iz IEnumerable<T>.To nije async methoda
                //AsQueryable Koristi se u svrhu izvršavanja LINQ upita nad kolekcijom koja implementira IEnumerable<T> sučelje.
                var query = _context.Activities.
                Where(d => d.Date >= request.Params.StartDate)
                .OrderBy(d => d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                new { currentUsername = _userAccessor.GetCurrentUsername() }).AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    //These filters will be aplied to currently logged in user
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetCurrentUsername()));
                }

                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    //Return activities where user is host
                    query = query.Where(x => x.HostUsername == _userAccessor.GetCurrentUsername());
                }

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }

        }
    }
}