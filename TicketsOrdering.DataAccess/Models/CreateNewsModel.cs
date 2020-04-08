using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class CreateNewsModel
    {
        public int UserId { get; set; }
        public string NewsTitle { get; set; }
        public string Body { get; set; }

    }
}
