using System.Net;
using System.Text.Json;
using Application.Core;
using Microsoft.Extensions.Hosting;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        //next is used to invoke the next piece of middleware in the pipeline
        //logger is used to log the exception
        //env is used to check if we are in development or production mode
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;

        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                //Prva stvar je prosljedit ga next middlewareu.Zato imamo catch za uhvatit exception
                await _next(context);
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment() ?
                    new AppException(20, ex.StackTrace?.ToString())
                : new AppException(context.Response.StatusCode, "Server Error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }

        }
    }
}