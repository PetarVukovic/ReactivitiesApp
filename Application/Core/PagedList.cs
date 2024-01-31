using Microsoft.EntityFrameworkCore;

namespace Application.Core
{

    /*Paging refers to getting partial results from an API. Imagine having 
        millions of results in the database and having your application try to 
        return all of them at once.
    */
    public class PagedList<T> : List<T>
    {
        //Pagination properties 

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            //Calculate the total number of pages
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            //Add the items to the list
            AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            //Get the total count of items in the source before paging
            //We re going to make two queries to our database, one to get the count and one to get the items
            var count = await source.CountAsync();

            //Get the items from the source.Ide fot his is 
            /*Logic behavio is that we are going to skip the number of items that we need to skip to get to the current page
            */
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            //Return the paged list
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }

    }
}