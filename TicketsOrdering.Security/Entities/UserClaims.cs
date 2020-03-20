using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.Security.Entities
{
    public class UserClaims
    {
        private readonly IEnumerable<Claim> _claims;
        public UserClaims(IEnumerable<Claim> claims)
        {
            _claims = claims;
        }

        public UserClaims()
        {
            _claims = new List<Claim>();
        }

        public User User
        {
            get
            {
                var userId = _claims.FirstOrDefault(x => x.Type == "UserId")?.Value;
                var universityGroupId = _claims.FirstOrDefault(x => x.Type == "UniversityGroupId")?.Value;
                var universityFacultyId = _claims.FirstOrDefault(x => x.Type == "UniversityFacultyId")?.Value;
                var roleId = _claims.FirstOrDefault(x => x.Type == "RoleId")?.Value;

                return new User
                {
                    UserId = int.Parse(userId ?? "0"),
                    UserLogin = _claims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value,
                    FullName = _claims.FirstOrDefault(x => x.Type == "FullName")?.Value,
                    UniversityGroupId = int.Parse(universityGroupId ?? "0"),
                    UniversityGroupName = _claims.FirstOrDefault(x => x.Type == "UniversityGroupName")?.Value,
                    UniversityFacultyId = int.Parse(universityFacultyId ?? "0"),
                    UniversityFacultyName = _claims.FirstOrDefault(x => x.Type == "UniversityFacultyName")?.Value,
                    RoleId = int.Parse(roleId ?? "0"),
                    RoleName = _claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value,
                    RoleNameUa = _claims.FirstOrDefault(x => x.Type == "RoleNameUa")?.Value,
                };
            }
        }
    }
}
