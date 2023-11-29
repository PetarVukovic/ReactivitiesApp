using System.Collections.Immutable;
using API.Extensions;
using Application.Activities;
using Application.Core;


/*builder docs
-Its going to create Kestrel server and host the application
-It ll read our config file we pass to it.appsetting and dev.json.
*/
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

/* Configure the HTTP request pipeline.
Middleware.It can do something with http request in its way in and out 
*/
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();//Registrira nase endpointove (kontrolere)

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (System.Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}


app.Run();
