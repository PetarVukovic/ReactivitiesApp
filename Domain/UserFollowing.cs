namespace Domain
{
    public class UserFollowing
    {
        public string ObserverId { get; set; }

        //Observer is the person who is following someone
        public AppUser Observer { get; set; }

        public string TargetId { get; set; }
        //Target is the person who is being followed
        public AppUser Target { get; set; }
    }
}