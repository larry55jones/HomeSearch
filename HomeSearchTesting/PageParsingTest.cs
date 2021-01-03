using AngleSharp.Dom;
using HomeSearchAPI.Processing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace HomeSearchTesting
{
    [TestClass]
    public class PageParsingTest
    {
        private string pageText;

        [TestInitialize]
        public void Init()
        {
            string filePath = $"{Environment.CurrentDirectory}\\SampleData\\testPage.html";
            if (!File.Exists(filePath))
            {
                Assert.Fail("Cannot find file to parse");
                return;
            }

            pageText = File.ReadAllText(filePath);
        }

        [TestMethod]
        public async Task ParsingSmokeTest()
        {
            HomeSearchResults results = await DataMining.MineDataFromText(pageText);
        }

        [TestMethod]
        public async Task GetPaginationControls()
        {
            IElement paginationControl = await DataMining.GetPaginationControl(pageText);
            Assert.IsNotNull(paginationControl);
        }

        [TestMethod]
        public async Task GetNumberOfPages()
        {
            int expectedPageCount = 3;
            int calculatedPageCount = await DataMining.GetDocumentPageCount(pageText);

            Assert.AreEqual(expectedPageCount, calculatedPageCount);
        }
    }
}
