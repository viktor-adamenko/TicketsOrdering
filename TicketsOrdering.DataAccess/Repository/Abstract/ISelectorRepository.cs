using System;
using System.Collections.Generic;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface ISelectorRepository
    {
        IEnumerable<UserRole> GetUserRoles(int roleId = 0);
        IEnumerable<UniversityFaculty> GetUniversityFaculties(int universityGroupId = 0);
        IEnumerable<UniversityGroup> GetUniversityGroups(int universityFacultyId = 0);
        IEnumerable<TicketType> GetTicketTypes();
        IEnumerable<CountOfTrips> GetCountOfTrips(int ticketTypeId);
        IEnumerable<TicketVariation> GetTicketVariations(int ticketTypeId, int countOfTrips);
        IEnumerable<PaymentMethod> GetPaymentMethods();
        IEnumerable<RequestState> GetRequestStates();
    }
}
