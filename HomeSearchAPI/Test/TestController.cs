using Microsoft.AspNetCore.Mvc;

namespace HomeSearchAPI.Test
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        [Route("")]
        public string Get()
        {
            return "Test";
        }

        [HttpGet]
        [Route("{input}")]
        public string Echo(string input)
        {
            return input;
        }
    }
}
