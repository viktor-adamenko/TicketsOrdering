using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Dapper;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;

namespace TicketsOrdering.DataAccess.Repository.Concrete
{
    public class NewsRepository : INewsRepository
    {
        private readonly string _connectionString;
        public NewsRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<NewsModel> GetNews(int userId, bool isRead)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "dbo.GetNews";

                return con.Query<NewsModel>(query, new { UserId = userId, IsRead = isRead }, commandType: CommandType.StoredProcedure);
            }
        }

        public void ReadNews(int userId, int newsId)
        {
            throw new NotImplementedException();
        }
    }
}
