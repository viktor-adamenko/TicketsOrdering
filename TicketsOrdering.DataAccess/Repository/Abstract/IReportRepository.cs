using System;
using System.Collections.Generic;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface IReportRepository
    {
        void CreateReport(int universityGroupId);
        void ToIssueTickets(int universityGroupId);
        IEnumerable<GroupedReportModel> GetReportsByFaculty(int universityFacultyId);
    }
}
