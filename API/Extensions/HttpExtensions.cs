using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            //Create new instance of paginationHeader.This is anonymous object which means we don't have to create a class for it.It should be type of object
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };


            //Convert paginationHeader to json
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            //Allow paginationHeader to be exposed in the header so that can be read by client
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}