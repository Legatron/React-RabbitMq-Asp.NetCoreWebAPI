using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Asp.NetCoreWebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GetTokenController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<GetTokenController> _logger;
        public GetTokenController(ILogger<GetTokenController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Name = "GetToken")]
        public IActionResult Get([FromBody] TokenRequest request)
        {
            if (request.Username == "username" && request.Password == "password")
            {
                var jwtConfig = _configuration.GetSection("Jwt").Get<JwtConfig>();
                var jwtGen = new JwtTokenGenerator(jwtConfig.IssuerSigningKey);
                var token = jwtGen.GenerateToken(request.Username);

                return Ok(token);
            }
            else
            {
                return Unauthorized();
            }
        }
        public class TokenRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}
