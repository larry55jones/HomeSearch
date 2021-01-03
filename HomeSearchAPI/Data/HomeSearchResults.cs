using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeSearchAPI.Data
{
    public class HomeSearchResults
    {
        public List<HomeForSale> HomesForSale { get; set; }

        public HomeSearchResults()
        {
            HomesForSale = new List<HomeForSale>();
        }

        public HomeSearchResults(List<HomeForSale> homesForSale)
        {
            HomesForSale = homesForSale;
        }
    }
}
