using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                this._photoAccessor = photoAccessor;
                this._userAccessor = userAccessor;
                this._dataContext = dataContext;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (user == null) return null;

                //We get the photo from the user we are deleting

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.id);

                if (photo == null) return null;

                //If the photo is the main photo, we return an error

                if (photo.IsMain) return Result<Unit>.Failure("You cannot delete your main photo");

                //We delete the photo from cloudinary

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if (result == null) return Result<Unit>.Failure("Problem deleting photo from cloudinary");

                user.Photos.Remove(photo);

                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from API");


            }
        }

    }

}