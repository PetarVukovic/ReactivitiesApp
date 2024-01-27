
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Application.Photos;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
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

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            });
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
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000").AllowCredentials();

                });
            });
            //Dodajemo MediatR
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssemblies(typeof(List.Handler).Assembly);
            });

            //Dodajemo AutoMapper
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();//Klasa inside assembly gdje validiramo
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccesor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddSignalR();




            return services;

        }
    }
}