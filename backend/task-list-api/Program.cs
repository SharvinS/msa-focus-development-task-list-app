using Microsoft.EntityFrameworkCore;
using TaskListApi.Data;
using TaskListApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Setting up CORS so Angular app can communicate with backend
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAngularApp",
        policy =>
        {
            // Allow requests from Angular app running on localhost:4200
            policy
                .WithOrigins("http://localhost:4200")
                // Allow any HTTP method
                .AllowAnyMethod()
                // Allow any headers in the request
                .AllowAnyHeader();
        }
    );
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        // Specifying the MySQL version used
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

// Registering the TaskRepository so it can be used for database operations
builder.Services.AddScoped<TaskRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAngularApp");

app.UseSwagger();
app.UseSwaggerUI();

// Redirect HTTP requests to HTTPS
app.UseHttpsRedirection();
app.UseAuthorization();

// Map the controllers to handle requests
app.MapControllers();

app.Run();
