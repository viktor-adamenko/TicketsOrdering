using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;

namespace TicketsOrdering.DataAccess.Repository.Concrete
{
    public class SelectorRepository : ISelectorRepository
    {
        private readonly string _connectionString;
        public SelectorRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<UserRole> GetUserRoles(int roleId = 0)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string condition = roleId != 0 ? $"WHERE Id={roleId}" : string.Empty;
                string query = $@"SELECT Id,
                                        Name RoleName,
                                        NameUa RoleNameUa
                                 FROM UserRole {condition}";

                return conn.Query<UserRole>(query);
            }
        }

        public IEnumerable<UniversityFaculty> GetUniversityFaculties(int universityGroupId = 0)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query;

                if (universityGroupId == 0)
                    query = @"SELECT Id, Description 
                              FROM UniversityFaculty";
                else
                    query = $@"SELECT DISTINCT uf.Id, uf.Description 
                                FROM UniversityGroup ug 
                                INNER JOIN UniversityFaculty uf ON ug.UniversityFacultyId = uf.Id
                                    AND ug.Id = {universityGroupId}";

                return conn.Query<UniversityFaculty>(query);
            }
        }

        public IEnumerable<UniversityGroup> GetUniversityGroups(int universityFacultyId = 0)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query;

                if (universityFacultyId == 0)
                    query = @"SELECT Id, Description 
                              FROM UniversityGroup";
                else
                    query = $@"SELECT DISTINCT ug.Id, ug.Description 
                                FROM UniversityGroup ug 
                                INNER JOIN UniversityFaculty uf ON ug.UniversityFacultyId = uf.Id
                                    AND uf.Id = {universityFacultyId}";

                return conn.Query<UniversityGroup>(query);
            }
        }

        public IEnumerable<TicketType> GetTicketTypes()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"SELECT Id
                                       ,Name
                                 FROM TicketsOrdering.dbo.TicketType";

                return conn.Query<TicketType>(query);
            }
        }

        public IEnumerable<CountOfTrips> GetCountOfTrips(int ticketTypeId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"SELECT DISTINCT CASE 
                                          WHEN tv.CountOfTrips = 999 THEN 'Необмежено'
                                          ELSE CAST(tv.CountOfTrips AS NVARCHAR)
                                       END CountText,
                                       tv.CountOfTrips Count
                                  FROM TicketVariation tv
                                  WHERE tv.TicketTypeId = @TicketTypeId";

                return conn.Query<CountOfTrips>(query, new { TicketTypeId = ticketTypeId });
            }
        }

        public IEnumerable<TicketVariation> GetTicketVariations(int ticketTypeId, int countOfTrips)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"SELECT tv.Id TicketVariationId
                                    ,tv.Description
                                    ,tv.Price 
                              FROM TicketVariation tv
                              WHERE tv.CountOfTrips = @CountOfTrips AND tv.TicketTypeId = @TicketTypeId";

                return conn.Query<TicketVariation>(query, new { CountOfTrips = countOfTrips, TicketTypeId = ticketTypeId });
            }
        }

        public IEnumerable<PaymentMethod> GetPaymentMethods()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"SELECT Id
                                       ,Description
                                 FROM PaymentMethod";

                return conn.Query<PaymentMethod>(query);
            }
        }
    }
}
