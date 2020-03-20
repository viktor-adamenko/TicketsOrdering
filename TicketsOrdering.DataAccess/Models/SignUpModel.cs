using System;
using System.Collections.Generic;
using System.Text;

namespace TicketsOrdering.DataAccess.Models
{
    public class SignUpModel
    {
        public string UserLogin { get; set; }
        public string UserPassword { get; set; }
        public string FullName { get; set; }
        public int UniversityGroupId { get; set; }
        public int RoleId { get; set; }
    }
}
