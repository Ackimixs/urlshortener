using Microsoft.EntityFrameworkCore;

namespace HolaTodos.Models;

public class Url
{
    public int id { get; set; }
    
    public string long_url { get; set; }
    
    public string code { get; set; }
}

public class UrlAdd
{
    public string long_url { get; set; } = null!;
    
    public string code { get; set; } = null!;
}

public class UrlUpdate
{
    public string? long_url { get; set; } = null!;
    
    public string? code { get; set; } = null!;
}

public class UrlDb : DbContext
{
    public UrlDb(DbContextOptions options) : base(options) { }
    public DbSet<Url> Urls { get; set; } = null!;
}