
using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            /* Sercices docs
            Add services to the container.Services are our app logic and expend our functionalities.
             We ll use DI to inject our services to other classes.
            */

            services.AddControllers();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            //Dodajemo CORS policy
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    //Dodajemo origin koji je dozvoljen
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            //Dodajemo MediatR
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblies(typeof(List.Handler).Assembly);
            });

            //Dodajemo AutoMapper
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;

        }
    }
}