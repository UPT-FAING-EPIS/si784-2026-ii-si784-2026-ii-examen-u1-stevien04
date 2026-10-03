using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NannyApp.API.Data;
using NannyApp.API.Models;

namespace NannyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BabysittersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BabysittersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Babysitter>>> GetBabysitters()
        {
            return await _context.Babysitters.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Babysitter>> GetBabysitter(Guid id)
        {
            var babysitter = await _context.Babysitters.FindAsync(id);

            if (babysitter == null)
            {
                return NotFound();
            }

            return babysitter;
        }
    }
}
