using HomeSearchAPI.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace HomeSearchAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomesController : ControllerBase
    {
        private readonly HomeSearchDbContext DB;

        public HomesController(HomeSearchDbContext context)
        {
            DB = context;
        }

        [HttpGet]
        public async Task<List<HomeForSale>> Get()
        {
            var query = (from h in DB.HomesForSale
                         from z in DB.IgnoredZips.Where(mapping => mapping.ZipCode == h.ZipCode).DefaultIfEmpty()
                         where z.ZipCode == null && h.Status >= 0
                         select h);

            string queryText = query.ToQueryString();

            return await query.ToListAsync();
        }

        [HttpPost]
        [Route("save/{homeID}")]
        public async Task<HomeForSale> SaveHome(int homeID)
        {
            HomeForSale homeForSale = DB.HomesForSale.Where(h => h.Id == homeID).FirstOrDefault();
            if (homeForSale == null)
                return null;

            homeForSale.Status = 1;
            await DB.SaveChangesAsync();
            return homeForSale;
        }

        [HttpPost]
        [Route("ignore/{homeID}")]
        public async Task<HomeForSale> IgnoreHome(int homeID)
        {
            HomeForSale homeForSale = DB.HomesForSale.Where(h => h.Id == homeID).FirstOrDefault();
            if (homeForSale == null)
                return null;

            homeForSale.Status = -1;
            await DB.SaveChangesAsync();
            return homeForSale;
        }

        [HttpPost]
        [Route("ignorezip/{homeID}")]
        public async Task<string> IgnoreHomeAndZip(int homeID)
        {
            HomeForSale homeForSale = DB.HomesForSale.Where(h => h.Id == homeID).FirstOrDefault();
            if (homeForSale == null)
                return null;

            IgnoredZip existingIgnoreRule = DB.IgnoredZips.Where(z => z.ZipCode == homeForSale.ZipCode).FirstOrDefault();
            if (existingIgnoreRule != null)
                return null;

            await DB.IgnoredZips.AddAsync(new IgnoredZip { ZipCode = homeForSale.ZipCode });
            await DB.SaveChangesAsync();

            return homeForSale.ZipCode;
        }
    }
}
