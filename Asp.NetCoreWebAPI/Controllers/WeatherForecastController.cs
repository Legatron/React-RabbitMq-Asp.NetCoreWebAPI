using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Asp.NetCoreWebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly RabbitMQService _rabbitMQService;
        public WeatherForecastController(ILogger<WeatherForecastController> logger, RabbitMQService rabbitMQService)
        {
            _logger = logger;
            _rabbitMQService = rabbitMQService;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IActionResult Get()
        {
           
            var weatherForecasts = Enumerable.Range(1, 5).Select(index => 
            { 
                var temperatureC = Random.Shared.Next(-10, 35);// more realistic temperature range
                return new WeatherForecast
                {
                    Id = index,
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = temperatureC,
                    Summary = GetSummary(temperatureC) // varied and consistent summaries
                };
            })
              .ToArray();

            _rabbitMQService.SendMessage(weatherForecasts);         

            return Ok(weatherForecasts);
        }

        [HttpGet("ConsumeMessage")]
        public IActionResult ConsumeMessage()
        {
            var message = _rabbitMQService.ConsumeMessage();
            return Ok(message);
        }
        private static string GetSummary(int temperatureC)
        {
            if (temperatureC < 0) return "Freezing";
            if (temperatureC < 10) return "Chilly";
            if (temperatureC < 20) return "Cool";
            if (temperatureC < 25) return "Mild";
            if (temperatureC < 30) return "Warm";
            return "Hot";
        }
    }

}
