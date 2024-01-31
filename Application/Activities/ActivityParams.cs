using Application.Core;

namespace Application.Activities
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; } // filter by is going
        public bool IsHost { get; set; } // filter by is host
        public DateTime StartDate { get; set; } = DateTime.UtcNow; // filter by start date
    }
}