using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public string Bio { get; set; }

        public ICollection<ActivityAttendee> Activities { get; set; }

        //This will be one to many relationship between AppUser and Photo
        public ICollection<Photo> Photos { get; set; }

        //This will be one to many relationship between AppUser and UserFollowing
        public ICollection<UserFollowing> Followings { get; set; }

        //This will be one to many relationship between AppUser and UserFollowing
        public ICollection<UserFollowing> Followers { get; set; }

    }
}
