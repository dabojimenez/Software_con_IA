using ApplicationLayer.Ports.PrimaryPort.Expenses;
using ApplicationLayer.Ports.SecundaryPort;
using ApplicationLayer.UseCases.Expenses;
using FileRepository;

var builder = WebApplication.CreateBuilder(args);

// Registro de las inyecciones de dependencias
builder.Services.AddSingleton<IRepository, ExpenseRepository>();
builder.Services.AddScoped<IRegisterExpense, RegisterExpenseUseCase>();
builder.Services.AddScoped<IGetExpenses, GetExpensesUseCase>();
builder.Services.AddScoped<IDeleteExpense, DeleteExpenseUseCase>();

var app = builder.Build();

app.MapGet("/", () => "API Corriendo");

app.Run();
