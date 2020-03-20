using System;
using System.Collections.Generic;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface IOrderRepository
    {
        void OrderTicket(OrderTicketModel orderTicketModel);
        IEnumerable<Request> GetOrdersByUser(int userId);
    }
}
