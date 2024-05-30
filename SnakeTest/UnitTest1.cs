using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace SnakeTest
{
    public class SnakeTest : IDisposable
    {
        private readonly ChromeDriver driver;

        public SnakeTest()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            driver = new ChromeDriver();
            driver.Navigate().GoToUrl("https://kissmartin.github.io/Snake_Project/");
        }

        public void Dispose()
        {
            driver.Quit();
        }

        [Fact]
        public void TestGameStartsCorrectly()
        {
            var startButton = driver.FindElement(By.ClassName("jatekGomb"));
            startButton.Click();

            var snake = driver.ExecuteScript("return window.kigyo;");
            Assert.NotNull(snake);
        }

        [Fact]
        public void TestAppleSpawnsAfterEating()
        {
            var startButton = driver.FindElement(By.ClassName("jatekGomb"));
            startButton.Click();

            // Spawnoljuk be elé az 

            var score = driver.FindElement(By.Id("score")).Text;
            Assert.Equal("1", score);

            var apples = driver.ExecuteScript("return window.alma;");
            Assert.NotNull(apples);
            Assert.True(((IReadOnlyCollection<object>)apples).Count > 0);
        }

        [Fact]
        public void TestGameEndsWhenSnakeHitsWall()
        {
            var startButton = driver.FindElement(By.ClassName("jatekGomb"));
            startButton.Click();

            Thread.Sleep(1000);

            var gameState = driver.ExecuteScript("return window.jatek;");
            Assert.False((bool)gameState);
        }

        [Fact]
        public void TestGameEndsWhenSnakeHitsTail()
        {
            var startButton = driver.FindElement(By.ClassName("jatekGomb"));
            startButton.Click();

            // Snake hossza legyen 10-15 hogy egyszerûbb legyen magába vezetni

            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowLeft);
            Thread.Sleep(300);
            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowDown);
            Thread.Sleep(300);
            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowRight);
            Thread.Sleep(300);
            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowUp);

            var gameState = driver.ExecuteScript("return window.jatek;");
            Assert.False((bool)gameState);
        }

        [Fact]
        public void TestGameEndsWithWin()
        {
            // Még nem jó

            driver.ExecuteScript("window.almakMax = 2;");

            var startButton = driver.FindElement(By.ClassName("jatekGomb"));
            startButton.Click();

            var score = driver.FindElement(By.Id("score")).Text;
            Assert.Equal("2", score);

            var gameState = driver.ExecuteScript("return window.jatek;");
            Assert.False((bool)gameState);
        }
    }
}
