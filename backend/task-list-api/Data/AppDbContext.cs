using Microsoft.EntityFrameworkCore;
using TaskListApi.Models;

namespace TaskListApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { } // Passing the options to the base class

        public DbSet<TaskItem> Tasks { get; set; } // Tasks table in the database
    }
}
