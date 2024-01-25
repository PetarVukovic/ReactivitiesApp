using Microsoft.AspNetCore.Http;

namespace Application.Photos
{
    public interface IPhotoAccessor
    {
        //IFormFile is an interface that represents a file sent with the HttpRequest
        //They will touch with our dataabse
        Task<PhotoUploadResult> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}