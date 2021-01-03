using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeSearchAPI.Entities
{
    public class HomeSearchDbContext : DbContext
    {
        public HomeSearchDbContext(DbContextOptions<HomeSearchDbContext> options) : base(options)
        {
        }

        public DbSet<HomeForSale> HomesForSale { get; set; }
        public DbSet<IgnoredZip> IgnoredZips { get; set; }
    }
}
