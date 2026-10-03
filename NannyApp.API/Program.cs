using Microsoft.EntityFrameworkCore;
using NannyApp.API.Data;
using NannyApp.API.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("NannyDb"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
    if (!context.Babysitters.Any())
    {
        context.Babysitters.Add(new Babysitter { Id = Guid.NewGuid(), Name = "Maria Garcia", ExperienceYears = 5, HourlyRate = 15.0m, Rating = 4.8, Availability = "M-F" });
        context.Babysitters.Add(new Babysitter { Id = Guid.NewGuid(), Name = "Laura Lopez", ExperienceYears = 3, HourlyRate = 12.0m, Rating = 4.5, Availability = "Weekends" });
        context.SaveChanges();
    }
}

if (true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();
