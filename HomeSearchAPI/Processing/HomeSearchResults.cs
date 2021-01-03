using HomeSearchAPI.Entities;
using System.Collections.Generic;

namespace HomeSearchAPI.Processing
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
