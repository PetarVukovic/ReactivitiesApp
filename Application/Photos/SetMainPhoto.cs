using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMainPhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                //wE need user object with images collection
                var user = await _dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null) return null;

                //We get the photo from the user photo collection

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null) return null;


                //We hold current main photo

                var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);


                //We set the current main photo to false because we are setting a new main photo
                if (currentMain != null) currentMain.IsMain = false;

                //We set the new photo to main

                photo.IsMain = true;

                //Update database

                var result = await _dataContext.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to set main photo");

                return Result<Unit>.Success(Unit.Value);


            }
        }
    }
}