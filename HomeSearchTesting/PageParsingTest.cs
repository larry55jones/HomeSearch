using HomeSearchAPI.Processing;
using HomeSearchAPI.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace HomeSearchTesting
{
    [TestClass]
    public class PageParsingTest
    {
        [TestMethod]
        public async Task ParsingSmokeTest()
        {
            string filePath = $"{Environment.CurrentDirectory}\\SampleData\\testPage.html";
            if (!File.Exists(filePath))
            {
                Assert.Fail("Cannot find file to parse");
                return;
            }

            string pageText = await File.ReadAllTextAsync(filePath);

            string homeListText = await DataMining.GetHomeListFromHTML(pageText);

            HomeSearchResults results = await DataMining.MineDataFromText(pageText);
        }
    }
}
