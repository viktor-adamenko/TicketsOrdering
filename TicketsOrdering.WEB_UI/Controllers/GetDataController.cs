using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;

namespace TicketsOrdering.WEB_UI.Controllers
{
    [Produces("application/json")]
    [Route("api/GetData")]
    public class GetDataController : Controller
    {
        private readonly ISelectorRepository _selectorRepository;
        public GetDataController(ISelectorRepository selectorRepository)
        {
            _selectorRepository = selectorRepository;
        }

        [HttpGet]
        [Route("GetRoles")]        
        public IActionResult GetRoles(int roleId = 0)
        {
            var model = _selectorRepository.GetUserRoles(roleId).Select(s => new { id = s.Id, text = s.RoleNameUa });
            return Json(model);
        }

        [HttpGet]
        [Route("GetUniversityFaculties")]
        public IActionResult GetUniversityFaculties(int universityGroupId = 0)
        {
            var model = _selectorRepository.GetUniversityFaculties(universityGroupId).Select(s => new { id = s.Id, text = s.Description });
            return Json(model);
        }

        [HttpGet]
        [Route("GetUniversityGroups")]
        public IActionResult GetUniversityGroups(int universityFacultyId = 0)
        {
            var model = _selectorRepository.GetUniversityGroups(universityFacultyId).Select(s => new { id = s.Id, text = s.Description });
            return Json(model);
        }

        [HttpGet]
        [Route("GetTicketTypes")]
        public IActionResult GetTicketTypes()
        {
            var model = _selectorRepository.GetTicketTypes().Select(s => new { id = s.Id, text = s.Name });
            return Json(model);
        }

        [HttpGet]
        [Route("GetCountOfTrips")]
        public IActionResult GetCountOfTrips(int ticketTypeId)
        {
            var model = _selectorRepository.GetCountOfTrips(ticketTypeId).Select(s => new { id = s.Count, text = s.CountText });
            return Json(model);
        }

        [HttpGet]
        [Route("GetTicketVariations")]
        public IActionResult GetTicketVariations(int ticketTypeId, int countOfTrips)
        {
            var model = _selectorRepository.GetTicketVariations(ticketTypeId, countOfTrips).Select(s => new { id = s.TicketVariationId, text = s.Description, price = s.Price });
            return Json(model);
        }

        [HttpGet]
        [Route("GetRequestStates")]
        public IActionResult GetRequestStates()
        {
            var model = _selectorRepository.GetRequestStates().Select(s => new { id = s.Id, text = s.Name});
            return Json(model);
        }
    }
}