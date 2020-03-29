using System;
using System.Collections.Generic;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface IRequestRepository
    {
        IEnumerable<Order> GetOrderRequestByUniversityGroup(int universityGroupId, int isClosed);
        void SaveChanges(List<SaveChangesModel> saveChangesModel);
    }
}
