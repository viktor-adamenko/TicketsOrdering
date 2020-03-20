using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using TicketsOrdering.DataAccess.Models;
using TicketsOrdering.DataAccess.Repository.Abstract;
using TicketsOrdering.Security.Abstract;

namespace TicketsOrdering.WEB_UI.Controllers
{
    public class AccountController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly ISecurityManager _securityManager;
        private readonly ISelectorRepository _selectorRepository;

        public AccountController(IUserRepository userRepository, ISecurityManager securityManager, ISelectorRepository selectorRepository)
        {
            _userRepository = userRepository;
            _securityManager = securityManager;
            _selectorRepository = selectorRepository;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            try
            {
                var user = await _userRepository.GetUserAsync(loginModel.Login, loginModel.Password);
                if (user != null)
                {             
                    await HttpContext.SignInAsync(_securityManager.GetClaimsPrincipal(user));

                    return Json(new {success = "true", redirectUrl = Url.Action("Index", "Page")});
                }

                return Json(new {success = "false", errorMessage = "Не правильний логін чи пароль"});
            }
            catch (Exception ex)
            {
                return Json(new { success = "false", errorMessage = $"Ошибка: {ex.Message}" });
            }
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Account");
        }

        public IActionResult SignUp()
        {
            return View("SignUp");
        }

        [HttpPost]
        public IActionResult SignUp(SignUpModel model)
        {
            _userRepository.AddUser(model);

            return Json(new { success = "true", redirectUrl = Url.Action("Index", "Account") });
        }
    }
}