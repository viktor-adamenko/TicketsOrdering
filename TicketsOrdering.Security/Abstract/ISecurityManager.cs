using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.Security.Abstract
{
    public interface ISecurityManager
    {
        ClaimsPrincipal GetClaimsPrincipal(User user);
    }
}
