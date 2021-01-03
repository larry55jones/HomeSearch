using System.ComponentModel;

namespace HomeSearchAPI.Data
{
    /// <summary>
    /// Object representing a home for sale
    /// </summary>
    public class HomeForSale
    {
        public int Id { get; set; }
        /// <summary>
        /// Name of realtor/agency or broker
        /// </summary>
        public string Broker { get; set; }

        /// <summary>
        /// Asking price, in dollars. $200k = 200000
        /// </summary>
        public int PriceInDollars { get; set; }

        /// <summary>
        /// Number of bedrooms
        /// </summary>
        public decimal BedCount { get; set; }

        /// <summary>
        /// Number of Bathrooms
        /// </summary>
        public decimal BathCount { get; set; }

        /// <summary>
        /// Full text of address
        /// </summary>
        public string AddressFull { get; set; }
        public string StreetName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string CoverImageURL { get; set; }
        public bool NewConstruction { get; set; }
        public string DetailPageURL { get; set; }

        /// <summary>
        /// Status of home. 0 = Unread, 1 = Saved, -1 = Ignored
        /// </summary>        
        [DefaultValue(0)]
        public int Status { get; set; }

        public HomeForSale()
        {
            Broker = string.Empty;
            BedCount = 0;
            BathCount = 0;
            PriceInDollars = 0;
            Status = 0;
        }
    }
}
