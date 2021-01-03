using HomeSearchAPI.Data;
using HomeSearchAPI.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace HomeSearchAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly HomeSearchDbContext DB;

        public UploadController(HomeSearchDbContext context)
        {
            DB = context;
        }

        [HttpPost]
        public async Task<HomeSearchResults> UploadFiles()
        {
            try
            {
                HomeSearchResults totalResults = new HomeSearchResults();
                IFormFileCollection files = HttpContext.Request.Form.Files;
                foreach (IFormFile f in files)
                {
                    var stream = f.OpenReadStream();
                    using var sr = new StreamReader(stream);
                    string result = await sr.ReadToEndAsync();
                    HomeSearchResults thisFileResults = await DataMining.MineDataFromText(result);
                    totalResults.HomesForSale.AddRange(thisFileResults.HomesForSale);
                }

                await SaveHomesForSale(totalResults);
                return new HomeSearchResults(DB.HomesForSale.ToList());
            }
            catch
            {
                // TODO: Log Exception
                throw;
            }
        }

        private async Task SaveHomesForSale(HomeSearchResults searchResults)
        {

            // Delete unseen results
            List<HomeForSale> existingHomesForSale = DB.HomesForSale.ToList();
            existingHomesForSale.ForEach(h =>
            {
                if (!searchResults.HomesForSale.Any(hh => hh.AddressFull == h.AddressFull))
                    DB.Entry(h).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
            });

            // Add Current Results
            searchResults.HomesForSale.ForEach((HomeForSale homeForSale) =>
            {
                HomeForSale existingDBHome = DB.HomesForSale.Where(h => h.AddressFull == homeForSale.AddressFull).FirstOrDefault();
                if (existingDBHome == null)
                {
                    DB.Add(homeForSale);
                } else
                {
                    existingDBHome.PriceInDollars = homeForSale.PriceInDollars;
                    existingDBHome.CoverImageURL = homeForSale.CoverImageURL;
                }
            });

            await DB.SaveChangesAsync();
        }
    }
}
