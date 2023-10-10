using HolaTodos.Models;
using Microsoft.AspNetCore.Mvc;

namespace HolaTodos.Controllers;

[ApiController]
public class Home : ControllerBase
{
    [HttpGet("/")]
    [Produces("text/html")]
    public string Index()
    {
        var fileContent = System.IO.File.ReadAllText("/home/acki/RiderProjects/HolaTodos/HolaTodos/templates/index.html");
        return fileContent;
    }
    
    [HttpGet("/r/{code}", Name = "RouteRedirect")]
    public IActionResult Redirect(string code, UrlDb db)
    {
        var url = db.Urls.FirstOrDefault(u => u.code == code);
        if (url == null)
        {
            return NotFound();
        }
        return Redirect(url.long_url);
    }
    
}