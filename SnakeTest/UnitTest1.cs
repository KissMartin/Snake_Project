using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using WebDriverManager;
using WebDriverManager.DriverConfigs.Impl;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System.Collections.ObjectModel;

namespace SnakeTest
{
    public class SnakeTest : IDisposable
    {
        private readonly ChromeDriver driver;
        private readonly WebDriverWait wait;

        public SnakeTest()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            driver = new ChromeDriver();
            driver.Manage().Window.Size = new System.Drawing.Size(1920, 1080);
            driver.Navigate().GoToUrl("https://kissmartin.github.io/Snake_Project/");
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        }

        public void Dispose()
        {
            driver.Quit();
        }

        private void GenNewApple(int x, int y, int sleepTime)
        {
            driver.ExecuteScript($"window.alma = [{x}, {y}];");
            driver.ExecuteScript("window.context.fillStyle = 'red'");
            driver.ExecuteScript($"window.context.fillRect({x}, {y}, 50, 50)");
            Thread.Sleep(sleepTime);
        }

        private void ClearDefaultApple()
        { 
            var currentApple = (ReadOnlyCollection<object>)driver.ExecuteScript("return window.alma;");
            int appleX = Convert.ToInt32(currentApple[0]);
            int appleY = Convert.ToInt32(currentApple[1]);
            driver.ExecuteScript($"window.context.clearRect({appleX}, {appleY}, 50, 50)");
            ReCreateBorder(appleX, appleY);
        }

        private void ReCreateBorder(int appleX, int appleY)
        {
            driver.ExecuteScript("window.context.beginPath()");
            driver.ExecuteScript("window.context.strokeStyle = 'black'");
            driver.ExecuteScript($"window.context.rect({appleX}, {appleY}, 50, 50)");
            driver.ExecuteScript("window.context.stroke()");
        }

        private void StartSnake()
        {
            var startButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.ClassName("jatekGomb")));
            startButton.Click();
        }

        [Fact]
        public void TestInput()
        {
            StartSnake();

            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowLeft);
            Assert.Equal("bal", driver.ExecuteScript("return window.irany"));
            Thread.Sleep(600);
            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowDown);
            Assert.Equal("le", driver.ExecuteScript("return window.irany"));
            Thread.Sleep(600);
            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowRight);
            Assert.Equal("jobb", driver.ExecuteScript("return window.irany"));
            Thread.Sleep(600);
            driver.FindElement(By.TagName("body")).SendKeys(Keys.ArrowUp);
            Assert.Equal("fel", driver.ExecuteScript("return window.irany"));
            Thread.Sleep(600);
        }

        [Fact]
        public void TestSnakeLengthIncremention()
        {
            StartSnake();

            ClearDefaultApple();

            GenNewApple(400, 200, 1500);

            Assert.Equal("5", driver.ExecuteScript("return window.hossz").ToString());
        }

        [Fact]
        public void TestGameStartsCorrectly()
        {
            StartSnake();

            var snake = driver.ExecuteScript("return window.kigyo;");
            Assert.NotNull(snake);
        }

        [Fact]
        public void TestAppleSpawnsAfterEating()
        {
            StartSnake();

            ClearDefaultApple();

            GenNewApple(400, 250, 1500);

            var apples = driver.ExecuteScript("return window.alma;");
            Assert.NotNull(apples);
        }


        [Fact]
        public void TestAppleAddsToScore()
        {
            StartSnake();

            ClearDefaultApple();

            GenNewApple(400, 200, 1500);

            var score = driver.FindElement(By.Id("score")).Text;
            Assert.Equal("1", score);
        }

        [Fact]
        public void TestGameEndsWhenSnakeHitsWall()
        {
            StartSnake();

            Thread.Sleep(3000);

            var gameState = driver.ExecuteScript("return window.jatek;");
            Assert.False((bool)gameState);
        }

        [Fact]
        public void TestGameEndsWhenSnakeHitsTail()
        {
            StartSnake();

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
            driver.ExecuteScript("window.almaMax = 2;");

            StartSnake();
            ClearDefaultApple();

            GenNewApple(400, 250, 1000);

            ClearDefaultApple();

            GenNewApple(400, 100, 1000);

            var score = driver.FindElement(By.Id("score")).Text;
            Assert.Equal("2", score);

            var gameState = driver.ExecuteScript("return window.jatek;");
            Assert.False((bool)gameState);
        }
    }
}
