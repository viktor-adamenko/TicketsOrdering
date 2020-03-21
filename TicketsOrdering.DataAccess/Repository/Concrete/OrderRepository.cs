using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
                string sqlQuery = @"DECLARE @Price MONEY = (SELECT TOP 1 Price FROM TicketVariation tv WHERE tv.Id = @TicketVariationId)
                                    INSERT INTO Request (UserId, TicketVariationId, RequestStateId, PaymentMethodId, Month, Price)
                                    VALUES (@UserId, @TicketVariationId, 1, @PaymentMethodId, @Month, @Price);";

                con.Execute(sqlQuery, new
                {
                    UserId = orderTicketModel.UserId,
                    TicketVariationId = orderTicketModel.TicketVariationId,
                    PaymentMethodId = orderTicketModel.PaymentMethodId,
                    Month = orderTicketModel.Month
                });
            }
        }

        public IEnumerable<Order> GetOrdersByUser(int userId, int isClosed)
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
                                    LEFT JOIN TicketVariation tv
                                      ON tv.Id = r.TicketVariationId
                                    LEFT JOIN [User] u
                                      ON r.UserId = u.Id
                                     LEFT JOIN RequestState rs 
                                      ON rs.Id = r.RequestStateId
                                     WHERE u.Id = @UserId and rs.IsClosed = @IsClosed";

                return con.Query<Order>(sqlQuery, new
                {
                    UserId = userId,
                    IsClosed = isClosed
                });
            }
        }
    }
}
