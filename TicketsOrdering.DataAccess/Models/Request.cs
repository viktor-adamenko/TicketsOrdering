using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class Request
    {
        public int Id { get; set; }
        public string TicketVariation { get; set; }
        public string CountOfTrips { get; set; }
        public decimal Price { get; set; }
        public string Month { get; set; }
        public string UserName { get; set; }
        public string RequestState { get; set; }
    }
}
