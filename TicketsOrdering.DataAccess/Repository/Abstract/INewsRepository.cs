using System;
using System.Collections.Generic;
using System.Text;
using TicketsOrdering.DataAccess.Models;

namespace TicketsOrdering.DataAccess.Repository.Abstract
{
    public interface INewsRepository
    {
        IEnumerable<NewsModel> GetNews(int userId, bool isRead);
        void ReadNews(int userId, int newsId);       
    }
}
