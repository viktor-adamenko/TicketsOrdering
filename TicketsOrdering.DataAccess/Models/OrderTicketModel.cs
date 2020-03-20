using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class OrderTicketModel
    {
        public DateTime? Month { get; set; }
        public int TicketVariationId { get; set; }
        public int PaymentMethodId { get; set; }
        public int UserId { get; set; }
    }
}
