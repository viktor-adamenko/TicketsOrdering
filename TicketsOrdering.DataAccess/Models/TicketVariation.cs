using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class TicketVariation
    {
        public int TicketVariationId { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}
