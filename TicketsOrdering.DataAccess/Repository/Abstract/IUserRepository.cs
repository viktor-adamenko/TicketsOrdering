using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface IUserRepository
    {
        Task<User> GetUserAsync(string login, string password);
        void AddUser(SignUpModel user);
    }
}
