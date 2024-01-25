using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    /*We need to have access to the cloudinary settings in order to upload photos to cloudinary.
    */
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);



        }
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                //We need to read the file into memory.OpenReadStream implenet disposed
                await using var stream = file.OpenReadStream();

                //We need to specify the upload parameters
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    //We need to specify the transformation of the photo into square image
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                //We need to upload the file to cloudinary
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                //We need to check if the upload was successful
                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                //We need to return the result
                return new PhotoUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };



            }

            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            //We need to specify the deletion parameters
            var deleteParams = new DeletionParams(publicId);

            //We need to delete the photo from cloudinary
            var result = await _cloudinary.DestroyAsync(deleteParams);

            //We need to check if the deletion was successful
            return result.Result == "ok" ? result.Result : null;

        }
    }
}