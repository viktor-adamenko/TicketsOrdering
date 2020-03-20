using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TicketsOrdering.WEB_UI.Controllers
{
    public class NewsController : Controller
    {

        public IActionResult NewsBlock(int userId)
        {
            return PartialView("NewsBlock");
        }

        public IActionResult AddNews()
        {
            return null;
        }

        public IActionResult ReadNews(int userId, int newsId)
        {
            return null;
        }        

        public IActionResult GetReadNews(int userId)
        {
            return null;
        }

        public IActionResult GetNotReadNews(int userId)
        {
            return null;
        }
    }
}