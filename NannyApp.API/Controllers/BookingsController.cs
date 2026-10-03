using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NannyApp.API.Data;
using NannyApp.API.Models;

namespace NannyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            booking.Id = Guid.NewGuid();
            booking.Status = "Confirmed";
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBooking", new { id = booking.Id }, booking);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings([FromQuery] Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return await _context.Bookings.ToListAsync();
            }
            return await _context.Bookings.Where(b => b.UserId == userId).ToListAsync();
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(Guid id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }
    }
}
