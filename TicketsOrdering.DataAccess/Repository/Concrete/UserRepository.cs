using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;

namespace TicketsOrdering.DataAccess.Repository.Concrete
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;
        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<User> GetUserAsync(string login, string password)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    string query = @"SELECT
                                      u.Id UserId
                                     ,u.UserLogin
                                     ,u.FullName
                                     ,u.UniversityGroupId
                                     ,ug.Description UniversityGroupName
                                     ,uf.Id UniversityFacultyId
                                     ,uf.Description UniversityFacultyName
                                     ,ur.Id RoleId
                                     ,ur.Name RoleName
                                    ,ur.NameUa RoleNameUa
                                    FROM dbo.[User] u
                                    LEFT JOIN dbo.UserRole ur
                                      ON ur.Id = u.RoleId
                                    LEFT JOIN UniversityGroup ug
                                      ON ug.Id = u.UniversityGroupId
                                    LEFT JOIN UniversityFaculty uf
                                      ON uf.Id = ug.UniversityFacultyId
                                    WHERE UserLogin = @Login
                                    AND UserPassword = @Password";

                    return await conn.QueryFirstOrDefaultAsync<User>(query, new
                    {
                        Login = login,
                        Password = password
                    });
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public void AddUser(SignUpModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO dbo.[User]
                                (
                                    RoleId,
                                    UniversityGroupId,
                                    UserLogin,
                                    UserPassword,
                                    FullName
                                )
                                VALUES
                                (   @RoleId,
                                    @UniversityGroupId,
                                    @UserLogin,
                                    @UserPassword, 
                                    @FullName
                                )";

                conn.Execute(query, new
                {
                    RoleId = model.RoleId,
                    UniversityGroupId = model.UniversityGroupId,
                    UserLogin = model.UserLogin,
                    UserPassword = model.UserPassword,
                    FullName = model.FullName
                });
            }
        }
    }
}
