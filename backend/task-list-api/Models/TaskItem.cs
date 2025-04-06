namespace TaskListApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; } // Unique identifier for each task
        public string Title { get; set; } // Short description of the task
        public DateTime DueDate { get; set; } // When the task is due
        public bool IsCompleted { get; set; } // Has the task been completed
    }
}
