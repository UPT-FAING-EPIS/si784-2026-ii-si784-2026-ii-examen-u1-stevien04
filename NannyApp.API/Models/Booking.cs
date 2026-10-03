using System;

namespace NannyApp.API.Models
{
    public class Booking
    {
        public Guid Id { get; set; }
        public Guid BabysitterId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }
}
