using Microsoft.EntityFrameworkCore;
using NannyApp.API.Models;

namespace NannyApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Babysitter> Babysitters { get; set; }
        public DbSet<Booking> Bookings { get; set; }
    }
}
