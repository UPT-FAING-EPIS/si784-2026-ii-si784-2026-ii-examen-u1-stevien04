using System;

namespace NannyApp.API.Models
{
    public class Babysitter
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int ExperienceYears { get; set; }
        public decimal HourlyRate { get; set; }
        public double Rating { get; set; }
        public string Availability { get; set; }
    }
}
