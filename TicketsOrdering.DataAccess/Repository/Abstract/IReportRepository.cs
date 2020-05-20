using System;
using System.Collections.Generic;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface IReportRepository
    {
        void CreateReport(int universityGroupId);
        void ToIssueTickets(int universityGroupId, DateTime? month, int? ticketTypeId);
        IEnumerable<GroupedReportModel> GetReportsByFaculty(int universityFacultyId, int? universityGroupId, DateTime? month, int? ticketTypeId);
    }
}
