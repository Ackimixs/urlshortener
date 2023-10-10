using Microsoft.AspNetCore.Mvc;
using HolaTodos.Models;

namespace HolaTodos.Controllers;

[ApiController]
[Route("/api/url", Name = "RouteApiUrl")]
public class ApiUrlController : ControllerBase
{
    private readonly ILogger<ApiUrlController> _logger;
    
    public ApiUrlController(ILogger<ApiUrlController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetApiUrl")]
    public IDictionary<string, IDictionary<string, IEnumerable<Url>>> Get(UrlDb db)
    {
        return new Dictionary<string, IDictionary<string, IEnumerable<Url>>>
        {
            {
                "body", new Dictionary<string, IEnumerable<Url>>
                {
                    { "url", db.Urls }
                }
            }
        };
    }

    [HttpGet("{id}", Name = "GetApiUrlByCode")]
    public Dictionary<string, IDictionary<string, Url?>> Get(int id, UrlDb db)
    {
        return new Dictionary<string, IDictionary<string, Url?>>
        {
            {
                "body", new Dictionary<string, Url?>
                {
                    { "url", db.Urls.Find(id) }
                }
            }
        };
    }
    
    [HttpPost(Name = "PostApiUrl")]
    public IDictionary<string, IDictionary<string, Url>> Post(UrlDb db, UrlAdd url)
    {
        var newUrl = db.Urls.Add(new Url { long_url = url.long_url, code = url.code });
        
        db.SaveChanges();
        return new Dictionary<string, IDictionary<string, Url>>
        {
            {
                "body", new Dictionary<string, Url>
                {
                    { "url", newUrl.Entity }
                }
            }
        };
    }

    [HttpPut("{id}", Name = "PutApiUrl")]
    public IDictionary<string, IDictionary<string, Url?>> Put(int id, UrlUpdate url, UrlDb db)
    {
        var urlToUpdate = db.Urls.Find(id);
        if (urlToUpdate == null)
        {
            return new Dictionary<string, IDictionary<string, Url?>>
            {
                {
                    "body", new Dictionary<string, Url?>
                    {
                        { "url", null }
                    }
                }
            };
        }

        urlToUpdate.long_url = url.long_url ?? urlToUpdate.long_url;
        urlToUpdate.code = url.code ?? urlToUpdate.code;
        db.SaveChanges();
        return new Dictionary<string, IDictionary<string, Url?>>
        {
            {
                "body", new Dictionary<string, Url?>
                {
                    { "url", urlToUpdate }
                }
            }
        };
    }
    
    [HttpDelete("{id}", Name = "DeleteApiUrl")]
    public IDictionary<string, IDictionary<string, Url?>> Delete(int id, UrlDb db)
    {
        var urlToDelete = db.Urls.Find(id);
        if (urlToDelete == null)
        {
            return new Dictionary<string, IDictionary<string, Url?>>
            {
                {
                    "body", new Dictionary<string, Url?>
                    {
                        { "url", null }
                    }
                }
            };
        }

        db.Urls.Remove(urlToDelete);
        db.SaveChanges();
        return new Dictionary<string, IDictionary<string, Url?>>
        {
            {
                "body", new Dictionary<string, Url?>
                {
                    { "url", urlToDelete }
                }
            }
        };
    }
}