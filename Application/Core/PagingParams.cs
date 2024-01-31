namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1; // default page number is 1
        private int _pageSize = 10; // default page size is 10
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // if value is greater than max page size, then set it to max page size
        }
    }
}
