using Microsoft.AspNetCore.Mvc;
using TaskListApi.Models;
using TaskListApi.Repositories;

namespace TaskListApi.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly TaskRepository _repository;

        public TaskController(TaskRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IEnumerable<TaskItem>> Get() => await _repository.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> Get(int id)
        {
            var task = await _repository.GetByIdAsync(id);
            return task == null ? NotFound() : task;
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> Post(TaskItem task)
        {
            await _repository.AddAsync(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, TaskItem task)
        {
            if (id != task.Id)
                return BadRequest();
            await _repository.UpdateAsync(task);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
