using AngleSharp;
using AngleSharp.Dom;
using HomeSearchAPI.Entities;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HomeSearchAPI.Processing
{
    public static class DataMining
    {
        /// <summary>
        /// Get Home Results Data from HTML Text
        /// </summary>
        /// <param name="pageText">Realtor Search Page HTML Content</param>
        /// <returns>HomeSearchResults</returns>
        public static async Task<HomeSearchResults> MineDataFromText(string pageText)
        {
            HomeSearchResults results = new HomeSearchResults();
            IDocument document = await GetDocumentAsync(pageText);

            // Get the element containing all our properties
            var houseLists = document.QuerySelectorAll("ul[data-testid=\"property-list-container\"]");
            var houseList = houseLists[0];

            // Get a list of li elements that contain property results
            var listOfHouseElements = houseList.QuerySelectorAll("li[data-testid=\"result-card\"]");
            foreach (IElement houseElement in listOfHouseElements)
            {
                results.HomesForSale.Add(ProcessHomeNode(houseElement.FirstChild));
            }

            // filter out new constructions
            results.HomesForSale = results.HomesForSale.Where(h => !h.NewConstruction).ToList();
            return results;
        }
        public static async Task<HomeSearchResults> MineDataFromFile(string filePath)
        {
            string pageText = await File.ReadAllTextAsync(filePath);
            return await MineDataFromText(pageText);
        }

        private static async Task<IDocument> GetDocumentAsync(string pageText)
        {
            //Use the default configuration for AngleSharp
            var config = Configuration.Default;

            //Create a new context for evaluating webpages with the given config
            var context = BrowsingContext.New(config);

            //Just get the DOM representation
            IDocument document = await context.OpenAsync(req => req.Content(pageText));

            return document;
        }

        private static HomeForSale ProcessHomeNode(INode homeNode)
        {
            // init home and get broker
            HomeForSale home = new HomeForSale
            {
                Broker = homeNode.ChildNodes.QuerySelectorAll("span[data-label=\"pc-brokered\"]").First()?.TextContent,
                NewConstruction = homeNode.ChildNodes.QuerySelectorAll("span[data-label=\"pc-new-construction\"]").Length > 0
            };

            // get price in dollars
            var priceElement = homeNode.ChildNodes.QuerySelectorAll("span[data-label=\"pc-price\"]").FirstOrDefault();
            if (priceElement != null)
            {
                Regex notNumbers = new Regex(@"[\D]");
                string priceProcessed = notNumbers.Replace(priceElement.TextContent, string.Empty);
                if (int.TryParse(priceProcessed, out int priceInt))
                    home.PriceInDollars = priceInt;
            }

            // get beds & baths count
            home.BedCount = GetBedBathCount(homeNode, "pc-meta-beds");
            home.BathCount = GetBedBathCount(homeNode, "pc-meta-baths");

            var addressNode = homeNode.ChildNodes.QuerySelectorAll("div[data-label=\"pc-address\"]").FirstOrDefault();
            if (addressNode != null)
            {
                home.AddressFull = addressNode.TextContent;
                var addressSections = addressNode.TextContent.Split(',');
                if (addressSections.Length >= 1)
                    home.StreetName = addressSections[0];

                if (addressSections.Length >= 2)
                    home.City = addressSections[1].Trim();

                if (addressSections.Length >= 3)
                {
                    string cityAndZip = addressSections[2].Trim();
                    Regex notNumbers = new Regex(@"[\D]");
                    home.ZipCode = notNumbers.Replace(cityAndZip, string.Empty);

                    Regex notCapLetters = new Regex(@"[^A-Z]");
                    home.State = notCapLetters.Replace(cityAndZip, string.Empty);
                }
            }

            // get cover image url
            var firstPictureNode = homeNode.ChildNodes.QuerySelectorAll("picture").FirstOrDefault();
            if (firstPictureNode != null)
            {
                var firstPictureImg = firstPictureNode.QuerySelectorAll("img").FirstOrDefault();
                string imgSource = firstPictureImg.Attributes.Where(a => a.Name == "data-src").FirstOrDefault()?.Value;
                home.CoverImageURL = imgSource;
            }

            // get detail link
            var aRelOpeners = homeNode.ChildNodes.QuerySelectorAll("a[rel=\"noopener\"]");
            if (aRelOpeners.Length > 0)
            {
                var firstLink = aRelOpeners.First();
                if (firstLink.HasAttribute("href"))
                {
                    home.DetailPageURL = firstLink.Attributes["href"].Value;
                    if (!home.DetailPageURL.StartsWith("https://realtor"))
                        home.DetailPageURL = $"https://realtor.com{home.DetailPageURL}";
                }
            }

            return home;
        }

        private static decimal GetBedBathCount(INode homeNode, string labelValue)
        {
            var bedsLi = homeNode.ChildNodes.QuerySelectorAll($"li[data-label=\"{labelValue}\"]").FirstOrDefault();
            if (bedsLi != null)
            {
                var bedsSpan = bedsLi.QuerySelectorAll("span[data-label=\"meta-value\"]").FirstOrDefault();
                _ = decimal.TryParse(bedsSpan.TextContent, out decimal bedsParsed);
                return bedsParsed;
            }

            return 0;
        }
    }
}
