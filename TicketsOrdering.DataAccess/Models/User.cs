using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string UserLogin { get; set; }
        public string FullName { get; set; }
        public int UniversityGroupId { get; set; }
        public string UniversityGroupName { get; set; }
        public int UniversityFacultyId { get; set; }
        public string UniversityFacultyName { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleNameUa { get; set; }
    }
}
