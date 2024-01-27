namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }

        /*IScANCELLED PROPERTY
        But of course we want to allow users to sign up or cancel their place on events.
        And what we'll also do at the same time is if the user is the host of an event, then we don't want

       them to be able to remove themselves from the event, but rather we're going to allow them to cancel

       the activity itself.

       And what this means is that we need another property on our activity to allow us to do this.
        */
        public bool IsCancelled { get; set; }

        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}