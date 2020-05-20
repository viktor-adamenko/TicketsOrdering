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
    public class OrderRepository : IOrderRepository
    {
        private readonly string _connectionString;
        public OrderRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void OrderTicket(OrderTicketModel orderTicketModel)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string sqlQuery = @"OrderTicket";

                con.Execute(sqlQuery, new
                {
                    UserId = orderTicketModel.UserId,
                    TicketVariationId = orderTicketModel.TicketVariationId,
                    PaymentMethodId = orderTicketModel.PaymentMethodId,
                    Month = orderTicketModel.Month
                }, commandType: CommandType.StoredProcedure);
            }
        }

        public IEnumerable<Order> GetOrdersByUser(int userId, int isClosed)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string sqlQuery = @"GetOrdersByUser";

                return con.Query<Order>(sqlQuery, new
                {
                    UserId = userId,
                    IsClosed = isClosed
                }, commandType: CommandType.StoredProcedure);
            }
        }

        public bool CheckTicketOrderingByMonth(int userId, DateTime? month)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string sqlQuery = @"SELECT TOP 1 Id
                                    FROM dbo.Request
                                     WHERE UserId = @UserId AND Month = @Month";

                var result =  con.Query<int>(sqlQuery, new
                {
                    UserId = userId,
                    Month = month
                });

                if (result.Count() == 1)                
                    return false;                

                return true;
            }
        }
    }
}
