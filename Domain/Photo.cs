namespace Domain
{
    public class Photo
    {
        public string Id { get; set; }

        //Url of photo is url of photo in cloudinary
        public string Url { get; set; }

        //isMain is a boolean that will tell us if the photo is the main photo of the user
        public bool IsMain { get; set; }

        //We need to add the public id of the photo.Purpose is to delete the photo from cloudinary
        public string PublicId { get; set; }
    }
}