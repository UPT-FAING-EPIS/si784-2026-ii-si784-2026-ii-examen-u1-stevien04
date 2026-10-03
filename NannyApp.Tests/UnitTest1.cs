using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NannyApp.API.Controllers;
using NannyApp.API.Data;
using NannyApp.API.Models;
using Xunit;

namespace NannyApp.Tests
{
    public class BabysitterTests
    {
        private AppDbContext GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var databaseContext = new AppDbContext(options);
            databaseContext.Database.EnsureCreated();
            return databaseContext;
        }

        [Fact]
        public async Task GetBabysitters_ReturnsAllBabysitters()
        {
            // Arrange
            var context = GetDatabaseContext();
            context.Babysitters.Add(new Babysitter { Id = Guid.NewGuid(), Name = "Test Nanny", ExperienceYears = 2, HourlyRate = 10m, Rating = 5.0, Availability = "M-F", Certifications = "None", Location = "City" });
            await context.SaveChangesAsync();
            var controller = new BabysittersController(context);

            // Act
            var result = await controller.GetBabysitters();

            // Assert
            var actionResult = Assert.IsType<ActionResult<System.Collections.Generic.IEnumerable<Babysitter>>>(result);
            var returnValue = Assert.IsType<System.Collections.Generic.List<Babysitter>>(actionResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task CreateBooking_ReturnsCreatedBooking()
        {
            // Arrange
            var context = GetDatabaseContext();
            var controller = new BookingsController(context);
            var booking = new Booking { Id = Guid.NewGuid(), BabysitterId = Guid.NewGuid(), UserId = Guid.NewGuid(), Date = DateTime.Now, Status = "Pending" };

            // Act
            var result = await controller.PostBooking(booking);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Booking>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnValue = Assert.IsType<Booking>(createdAtActionResult.Value);
            Assert.Equal("Pending", returnValue.Status);
        }
    }
}
