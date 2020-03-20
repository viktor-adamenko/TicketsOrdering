using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.Security.Abstract;

namespace TicketsOrdering.Security.Concrete
{
    public class SecurityManager:ISecurityManager
    {
        private const string AuthenticationScheme = "Cookies";

        public ClaimsPrincipal GetClaimsPrincipal(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserLogin),
                new Claim("FullName", user.FullName),
                new Claim("UniversityGroupId", user.UniversityGroupId.ToString()),
                new Claim("UniversityGroupName", user.UniversityGroupName),
                new Claim("UniversityFacultyId", user.UniversityFacultyId.ToString()),
                new Claim("UniversityFacultyName", user.UniversityFacultyName),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim(ClaimTypes.Role, user.RoleName),
                new Claim("RoleNameUa", user.RoleNameUa)
            };

            var claimsIdentity = new ClaimsIdentity(claims, AuthenticationScheme);
            var principal = new ClaimsPrincipal(claimsIdentity);

            return principal;
        }
    }
}
