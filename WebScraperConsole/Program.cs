using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

namespace WebScraperConsoleTest
{
    class Program
    {
        static IConfiguration Configuration;
        static void Main(params string[] args)
        {
            ReadConfig();

            string baseDirectory = GetBaseDir(args);
            Console.WriteLine($"Using Directory: {baseDirectory}");

            Console.WriteLine("Starting Scrape...");
            Scrape(baseDirectory);

            Console.WriteLine("Scrape Finished");

            Process.Start("explorer.exe", baseDirectory);
            var ps = new ProcessStartInfo(Configuration["WebUrl"] + "/upload")
            {
                UseShellExecute = true,
                Verb = "open"
            };
            Process.Start(ps);
        }

        private static string GetBaseDir(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Please Enter Directory to Save Files to"); ;
                return Console.ReadLine();
            }

            return args[0];
        }

        private static void Scrape(string baseDir)
        {
            try
            {
                ChromeOptions chromeOptions = new ChromeOptions();
                using IWebDriver driver = new ChromeDriver(chromeOptions);
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromMinutes(5));

                int pageNumber = 1;
                Console.WriteLine("Visiting main search url");

                // visit search url
                driver.Navigate().GoToUrl(Configuration["SearchURL"]);

                Console.WriteLine("Waiting for Property List to Appear");

                // wait for home list to appear
                wait.Until(By.CssSelector("ul[data-testid=\"property-list-container\"]").FindElement);

                string currentUrl = driver.Url;
                Console.WriteLine($"Detected URL: {currentUrl}");

                Thread.Sleep(333);

                Console.WriteLine($"Saving Page {pageNumber}");

                // write page content to file
                File.WriteAllText($"{baseDir}\\page{pageNumber}.html", driver.PageSource);

                pageNumber++;

                while (BrowserIsOpen(driver))
                {
                    Console.WriteLine("Waiting Until the URL Changes...");

                    wait.Until(d => d.Url != currentUrl);

                    Console.WriteLine("URL Changed!");

                    currentUrl = driver.Url;
                    Console.WriteLine($"Detected URL: {currentUrl}");

                    Console.WriteLine("Waiting for Property List to Appear");
                    wait.Until(By.CssSelector("ul[data-testid=\"property-list-container\"]").FindElement);

                    Console.WriteLine($"Saving Page {pageNumber}");
                    Thread.Sleep(333);

                    // write page content to file
                    File.WriteAllText($"{baseDir}\\page{pageNumber}.html", driver.PageSource);

                    pageNumber++;
                }
            } catch {}
        }

        private static bool BrowserIsOpen(IWebDriver driver)
        {
            try
            {
                driver.GetType();
                return true;
            }
            catch
            {
                return false;
                throw;
            }
        }

        private static void ReadConfig()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile($"appsettings.json", true, true);

            Configuration = builder.Build();
        }
    }
}
