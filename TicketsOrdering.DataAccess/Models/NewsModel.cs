using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class NewsModel
    {
        public int Id { get; set; }
        public bool IsRead { get; set; }
        public string NewsTitle { get; set; }
        public string CreatedDate { get; set; }
        public string Author { get; set; }
        public string Body { get; set; }
    }
}
