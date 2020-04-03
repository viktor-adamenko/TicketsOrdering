using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class ReportModel
    {        
        public int UniversityGroupId { get; set; }
        public string UniversityGroupName { get; set; }
        public int TicketVariationId { get; set; }
        public string TicketVariationName { get; set; }
        public int CountOfTrips { get; set; }
        public string Month { get; set; }
        public int Amount { get; set; }
        public decimal SumPrice { get; set; }        
    }

    public class GroupedReportModel
    {
        public int UniversityGroupId { get; set; }
        public string UniversityGroupName { get; set; }
        public IEnumerable<ReportModel> ReportModel { get; set; }
    }
}
