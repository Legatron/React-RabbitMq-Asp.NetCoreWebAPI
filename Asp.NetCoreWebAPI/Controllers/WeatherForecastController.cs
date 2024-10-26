using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Asp.NetCoreWebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly RabbitMQService _rabbitMQService;
        public WeatherForecastController(ILogger<WeatherForecastController> logger, RabbitMQService rabbitMQService)
        {
            _logger = logger;
            _rabbitMQService = rabbitMQService;
        }

        //[HttpGet(Name = "GetWeatherForecast")]
        //public IEnumerable<WeatherForecast> Get()
        //{
        //    //Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:5174");
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        //        TemperatureC = Random.Shared.Next(-20, 55),
        //        Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}
        [HttpGet(Name = "GetWeatherForecast")]
        public IActionResult Get()
        {
            _rabbitMQService.SendMessage("Controller was hit");

            var weatherForecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();

            //Response.Headers.Append("Access-Control-Allow-Origin", "*");

            return Ok(weatherForecasts);
        }

        [HttpGet("ConsumeMessage")]
        public IActionResult ConsumeMessage()
        {
            var message = _rabbitMQService.ConsumeMessage();
            return Ok(message);
        }
    }
}
