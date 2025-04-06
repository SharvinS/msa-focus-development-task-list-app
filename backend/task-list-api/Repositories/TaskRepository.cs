using Microsoft.EntityFrameworkCore;
using TaskListApi.Data;
using TaskListApi.Models;

namespace TaskListApi.Repositories
{
    public class TaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context)
        {
            _context = context; // Store the database context here
        }

        public async Task<IEnumerable<TaskItem>> GetAllAsync() =>
            // Grab all the tasks from the database
            await _context.Tasks.ToListAsync();

        public async Task<TaskItem> GetByIdAsync(int id) =>
            // Find a specific task by its ID
            await _context.Tasks.FindAsync(id);

        public async Task AddAsync(TaskItem task)
        {
            // Add a new task to the database
            _context.Tasks.Add(task);
            // Save the changes
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TaskItem task)
        {
            // Update an existing task
            _context.Tasks.Update(task);
            // Save the changes
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            // Find the task
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                // Remove the task
                _context.Tasks.Remove(task);
                // Save the changes
                await _context.SaveChangesAsync();
            }
            // If task is null, nothing to delete and just exit
        }
    }
}
