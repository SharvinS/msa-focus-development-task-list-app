using Microsoft.EntityFrameworkCore;
using TaskListApi.Models;

namespace TaskListApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<TaskItem> Tasks { get; set; }
    }
}
