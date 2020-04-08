using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;
using TicketsOrdering.DataAccess.Repository.Concrete;

namespace TicketsOrdering.WEB_UI.Controllers
{
    public class NewsController : Controller
    {
        private readonly INewsRepository _newsRepository;
        public NewsController(INewsRepository newsRepositiry)
        {
            _newsRepository = newsRepositiry;
        }

        public IActionResult NewsBlock(int userId)
        {
            return PartialView("NewsBlock");
        }

        [HttpPost]
        public IActionResult AddNews(CreateNewsModel createNewsModel)
        {
            try
            {
                _newsRepository.AddNews(createNewsModel);

                return Json(new { success = true, message = "Дані були успішно збережені" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public IActionResult ReadNews(int userId, int newsId)
        {
            _newsRepository.ReadNews(userId, newsId);

            return Json(new { success = true });
        }        

        public IActionResult GetReadNews(int userId)
        {
            var model = _newsRepository.GetNews(userId, true);
            return Json(model,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }

        public IActionResult GetNotReadNews(int userId)
        {
            var model = _newsRepository.GetNews(userId, false);
            return Json(model,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
        }
    }
}