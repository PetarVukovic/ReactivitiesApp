using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }

        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _dataContext = dataContext;

            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                //e need to get the user from the database
                var user = await _dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                //If the user is null, we return null

                if (user == null) return null;

                //If the user is not null, we need to upload the photo to cloudinary

                var uploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = uploadResult.Url,
                    Id = uploadResult.PublicId
                };

                //If the user has no photos, we set the photo as the main photo
                if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;

                //We add the photo to the user
                user.Photos.Add(photo);

                var result = await _dataContext.SaveChangesAsync() > 0;

                if (!result) return Result<Photo>.Failure("Failed to add photo");

                return Result<Photo>.Success(photo);
            }
        }

    }
}