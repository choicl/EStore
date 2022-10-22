using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext: DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=(local);Initial Catalog=EStoreDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
    }
    public StoreContext(DbContextOptions options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
}