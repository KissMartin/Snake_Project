using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;


namespace SnakeTest
{
    public class SnakeTest : IDisposable
    {
        private readonly ChromeDriver driver;

        public void Dispose()
        {
            driver.Dispose();
        }

        public SnakeTest()
        {
            driver = new ChromeDriver();
            driver.Navigate().GoToUrl("https://kissmartin.github.io/Snake_Project/");
        }
    }
}