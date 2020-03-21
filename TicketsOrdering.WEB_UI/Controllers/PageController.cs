using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;
using TicketsOrdering.DataAccess.Repository.Concrete;
using TicketsOrdering.Security.Entities;

namespace TicketsOrdering.WEB_UI.Controllers
{
    [Authorize]
    public class PageController : Controller
    {
        private UserClaims UserClaims => new UserClaims(HttpContext.User.Claims);

        private readonly IOrderRepository _orderRepository;
        private readonly ISelectorRepository _selectorRepository;

        public PageController(IOrderRepository orderRepository, ISelectorRepository selectorRepository)
        {
            _orderRepository = orderRepository;
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
    }
}