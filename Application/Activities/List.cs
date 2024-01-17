using Application.Core;
using Domain;
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
        public class Query : IRequest<Result<List<Activity>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            /*cancellationToken je token koji se koristi za otkazivanje operacije.
            */
            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.ToListAsync();
                return Result<List<Activity>>.Success(activities);
            }

        }
    }
}