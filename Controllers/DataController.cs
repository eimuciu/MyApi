using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
using System;


namespace MyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly string _jsonFilePath;

        public DataController(IWebHostEnvironment env)
        {
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data.json");
        }

        [HttpGet]
        public async Task<ActionResult<string>> Index()
        {
            using (var reader = new StreamReader(_jsonFilePath))
            {
                var json = await reader.ReadToEndAsync();
                var rectData = JsonSerializer.Deserialize<Rect>(json);
                return Ok(rectData);
            }
        }

        [HttpPost]
        public async Task<ActionResult<string>> AddData([FromBody] Rect data)
        {

            if (data.Width > data.Height)
            {
                using (var reader = new StreamReader(_jsonFilePath))
                {
                    var json = await reader.ReadToEndAsync();
                    var rectData = JsonSerializer.Deserialize<Rect>(json);
                    return Ok(new { success = false, data = rectData });
                }
            }

            await Task.Delay(10000);

            var jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });

            System.IO.File.WriteAllText(_jsonFilePath, jsonString);

            return Ok(new { success = true, data = jsonString });
        }
    }
}

public class Rect
{
    public float Width { get; set; }
    public float Height { get; set; }
}