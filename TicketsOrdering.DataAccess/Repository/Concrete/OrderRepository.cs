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

        public IEnumerable<Request> GetOrdersByUser(int userId)
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
                                          ,CASE WHEN MONTH(r.Month) = 1 THEN  'Січень'
                                            WHEN MONTH(r.Month) = 2 THEN  'Лютий'
                                            WHEN MONTH(r.Month) = 3 THEN  'Березень'
                                            WHEN MONTH(r.Month) = 4 THEN  'Квітень'
                                            WHEN MONTH(r.Month) = 5 THEN  'Травень'
                                            WHEN MONTH(r.Month) = 6 THEN  'Червень'
                                            WHEN MONTH(r.Month) = 7 THEN  'Липень'
                                            WHEN MONTH(r.Month) = 8 THEN  'Серпень'
                                            WHEN MONTH(r.Month) = 9 THEN  'Вересень'
                                            WHEN MONTH(r.Month) = 10 THEN  'Жовтень'
                                            WHEN MONTH(r.Month) = 11 THEN  'Листопад'
                                            WHEN MONTH(r.Month) = 12 THEN  'Грудень'
                                            ELSE NULL
                                          END Month
                                         ,u.FullName UserName
                                         ,rs.Name RequestState
                                    FROM Request r
                                    LEFT JOIN TicketVariation tv
                                      ON tv.Id = r.TicketVariationId
                                    LEFT JOIN [User] u
                                      ON r.UserId = u.Id
                                     LEFT JOIN RequestState rs 
                                      ON rs.Id = r.RequestStateId
                                     WHERE u.Id = @UserId";

                return con.Query<Request>(sqlQuery, new
                {
                    UserId = userId
                });
            }
        }
    }
}
