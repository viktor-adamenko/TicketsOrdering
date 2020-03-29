using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;
using TicketsOrdering.DataAccess.Repository.Concrete;
using TicketsOrdering.Security.Entities;

namespace TicketsOrdering.WEB_UI.Controllers
{
    //[Produces("application/json")]
    [Authorize]
    public class PageController : Controller
    {
        private UserClaims UserClaims => new UserClaims(HttpContext.User.Claims);

        private readonly IOrderRepository _orderRepository;
        private readonly IRequestRepository _requestRepository;
        private readonly ISelectorRepository _selectorRepository;

        public PageController(IOrderRepository orderRepository, ISelectorRepository selectorRepository, IRequestRepository requestRepository)
        {
            _orderRepository = orderRepository;
            _requestRepository = requestRepository;
            _selectorRepository = selectorRepository;
        }

        public IActionResult Index()
        {
            ViewBag.UserClaims = UserClaims;
            ViewBag.PaymentMethods = _selectorRepository.GetPaymentMethods();

            return View();
        }

        public IActionResult MyOrders()
        {
            return PartialView("_MyOrders");
        }

        public IActionResult ProFormaRequests()
        {
            return PartialView("_ProFormaRequests");
        }

        [HttpPost]
        public IActionResult OrderTicket(OrderTicketModel model)
        {
            try
            {
                _orderRepository.OrderTicket(model);

                return Json(new { success = true, message = "Заявка була успішно відправлена" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }            
        }

        [HttpGet]
        public IActionResult GetOrdersByCurrentUser(int isClosed)
        {
            var data = _orderRepository.GetOrdersByUser(UserClaims.User.UserId, isClosed);

            return Json(new {data = data},
                new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()});
        }

        [HttpGet]
        public IActionResult GetRequestOrdersByUniversityGroup(int isClosed)
        {
            var data = _requestRepository.GetOrderRequestByUniversityGroup(UserClaims.User.UniversityGroupId, isClosed);

            return Json(new { data = data },
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }

        [HttpPost]
        [Produces("application/json")]
        public IActionResult SaveChanges([FromBody] List<SaveChangesModel> saveChangesModel)
        {
            try
            {
                _requestRepository.SaveChanges(saveChangesModel);
                return Json(new {success = true, message = "Дані були успішно збережені"});
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }            
        }
    }
}