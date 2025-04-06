using Microsoft.AspNetCore.Mvc;
using TaskListApi.Models;
using TaskListApi.Repositories;

namespace TaskListApi.Controllers
{
    [Route("api/tasks")] // All routes in this controller will start with "api/tasks"
    [ApiController] // Specifies that this is an API controller
    public class TaskController : ControllerBase
    {
        private readonly TaskRepository _repository;

        public TaskController(TaskRepository repository)
        {
            _repository = repository; // Use TaskRepository to communicate with the database
        }

        [HttpGet] // GET /api/tasks - Get all tasks
        public async Task<IEnumerable<TaskItem>> Get() => await _repository.GetAllAsync();

        [HttpGet("{id}")] // GET /api/tasks/{id} - Get a specific task by ID
        public async Task<ActionResult<TaskItem>> Get(int id)
        {
            var task = await _repository.GetByIdAsync(id);
            return task == null ? NotFound() : task; // If not found, return a 404 Not Found
        }

        [HttpPost] // POST /api/tasks - Create a new task
        public async Task<ActionResult<TaskItem>> Post(TaskItem task)
        {
            await _repository.AddAsync(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task); // Return 201 created with the new task
        }

        [HttpPut("{id}")] // PUT /api/tasks/{id} - Update an existing task
        public async Task<IActionResult> Put(int id, TaskItem task)
        {
            if (id != task.Id)
                return BadRequest(); // If the ID in the URL doesn't match the task's ID, it's a bad request
            await _repository.UpdateAsync(task);
            return NoContent(); // Return 204 no content on success
        }

        [HttpDelete("{id}")] // DELETE /api/tasks/{id} - Delete a task
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent(); // Return 204 no content on success
        }
    }
}
