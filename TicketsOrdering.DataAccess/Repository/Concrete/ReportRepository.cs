using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;

namespace TicketsOrdering.DataAccess.Repository.Concrete
{
    public class ReportRepository : IReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateReport(int universityGroupId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "dbo.CreateReportByGroup";

                con.Execute(query, new { UniversityGroupId = universityGroupId }, commandType: CommandType.StoredProcedure);
            }
        }

        public void ToIssueTickets(int universityGroupId, DateTime? month, int? ticketTypeId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "dbo.ToIssueTickets";

                con.Execute(query, new
                {
                    UniversityGroupId = universityGroupId,
                    Month = month,
                    TicketTypeId = ticketTypeId
                }, commandType: CommandType.StoredProcedure);
            }
        }

        public IEnumerable<GroupedReportModel> GetReportsByFaculty(int universityFacultyId, int? universityGroupId, DateTime? month, int? ticketTypeId)
        {
            List<GroupedReportModel> groupedReportModels = new List<GroupedReportModel>();
            IEnumerable<ReportModel> reportModel;
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "dbo.GetReportsByFaculty";

                reportModel = con.Query<ReportModel>(query, new
                {
                    UniversityFacultyId = universityFacultyId,
                    UniversityGroupId = universityGroupId,
                    Month = month,
                    TicketTypeId = ticketTypeId
                }, commandType: CommandType.StoredProcedure).ToList();
            }

            var groupedModel = reportModel
                   .GroupBy(x => new { x.UniversityGroupId, x.UniversityGroupName })
                   .Select(s => new { UniversityGroupId = s.Key.UniversityGroupId, UniversityGroupName = s.Key.UniversityGroupName });

            foreach (var g in groupedModel)
            {
                var repModelByGroup = reportModel.Where(x => x.UniversityGroupId == g.UniversityGroupId);

                GroupedReportModel model = new GroupedReportModel();
                model.UniversityGroupId = g.UniversityGroupId;
                model.UniversityGroupName = g.UniversityGroupName;
                model.ReportModel = repModelByGroup;

                groupedReportModels.Add(model);
            }

            return groupedReportModels;
        }
    }
}
