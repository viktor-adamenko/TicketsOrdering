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
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "ReadNewsByUser";

                con.Execute(query, new { UserId = userId, NewsId = newsId }, commandType: CommandType.StoredProcedure);
            }
        }

        public void AddNews(CreateNewsModel createNewsModel)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                var query = "INSERT INTO News (CreatedBy, Title, Body) VALUES (@UserId, @NewsTitle, @Body)";

                con.Execute(query, new { UserId = createNewsModel.UserId, NewsTitle = createNewsModel.NewsTitle, Body = createNewsModel.Body });
            }
        }
    }
}
