using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using Dapper;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;

namespace TicketsOrdering.DataAccess.Repository.Concrete
{
    public class RequestRepository : IRequestRepository
    {
        private readonly string _connectionString;
        public RequestRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<Order> GetOrderRequestByUniversityGroup(int universityGroupId, int isClosed)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string sqlQuery = @"SELECT
                                      r.Id
                                     ,tv.Description TicketVariation
                                     ,CASE
                                        WHEN tv.CountOfTrips = 999 THEN 'Не обмежено'
                                        ELSE CAST(tv.CountOfTrips AS VARCHAR)
                                      END CountOfTrips
                                     ,r.Price
                                     ,dbo.DateTimeToMonthUa(r.Month) Month
                                     ,u.FullName UserName
                                     ,rs.Id RequestStateId
                                     ,rs.Name RequestState
                                    FROM Request r
                                    LEFT JOIN RequestState rs
                                      ON rs.Id = r.RequestStateId
                                    LEFT JOIN TicketVariation tv
                                      ON r.TicketVariationId = tv.Id
                                    LEFT JOIN [User] u
                                      ON u.Id = r.UserId
                                    LEFT JOIN UniversityGroup ug
                                      ON ug.Id = u.UniversityGroupId

                                    WHERE ug.Id = @UniversityGroupId and rs.IsClosed = @IsClosed";

                return con.Query<Order>(sqlQuery, new
                {
                    UniversityGroupId = universityGroupId,
                    IsClosed = isClosed
                });
            }
        }

        public void SaveChanges(List<SaveChangesModel> saveChangesModel)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Request SET RequestStateId = @RequestStateId WHERE Id = @RequestId";

                foreach (var model in saveChangesModel)
                {
                    con.Execute(query, new {RequestStateId = model.RequestStateId, RequestId = model.RequestId });
                }
            }
        }
    }
}
