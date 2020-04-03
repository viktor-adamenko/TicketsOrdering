using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TicketsOrdering.DataAccess.Repository.Abstract;
using TicketsOrdering.DataAccess.Repository.Concrete;
using TicketsOrdering.Security.Abstract;
using TicketsOrdering.Security.Concrete;
using TicketsOrdering.WEB_UI.Controllers;

namespace TicketsOrdering.WEB_UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = new PathString("/Account/Index");                    
                });

            var connString = Configuration.GetConnectionString("TicketsOrdering");
            
            services.AddTransient<IUserRepository>(s => new UserRepository(connString));            
            services.AddTransient<ISelectorRepository>(s => new SelectorRepository(connString));
            services.AddTransient<IOrderRepository>(s => new OrderRepository(connString));
            services.AddTransient<IRequestRepository>(s => new RequestRepository(connString));
            services.AddTransient<IReportRepository>(s => new ReportRepository(connString));

            services.AddTransient<ISecurityManager, SecurityManager>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            
            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Page}/{action=Index}/{id?}");
            });
        }
    }
}
