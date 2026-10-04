using ExpenseAPI.Contracts;
using MyExpenses.Domain.Entities;
using MyExpenses.Domain.Exceptions;

using ApplicationLayer.Ports.PrimaryPort.Expenses;
using ApplicationLayer.Ports.SecundaryPort;
using ApplicationLayer.UseCases.Expenses;
using FileRepository;

var builder = WebApplication.CreateBuilder(args);

// Registro de las inyecciones de dependencias
builder.Services.AddSingleton<IRepository<Expense>, ExpenseRepository>();
builder.Services.AddSingleton<IRepository<Category>, CategoryRepository>();
builder.Services.AddScoped<IRegisterExpense, RegisterExpenseUseCase>();
builder.Services.AddScoped<IGetExpenses, GetExpensesUseCase>();
builder.Services.AddScoped<IDeleteExpense, DeleteExpenseUseCase>();

var app = builder.Build();

app.MapGet("/", () => "API Corriendo");

app.MapPost("/expenses", async Task<IResult> (
	CreateExpenseRequest request,
	IRegisterExpense registerExpense) =>
{
	try
	{
		var expense = new Expense(
			request.Concept,
			request.Amount,
			request.Date,
			request.Currency,
			request.IdCategory,
			request.Note);

		await registerExpense.RegisterAsync(expense);
		return Results.Created("/expenses", expense);
	}
	catch (DomainException exception)
	{
		return Results.BadRequest(new { error = exception.Message });
	}
});

app.MapGet("/expenses", async Task<IResult> (IGetExpenses getExpenses) =>
	Results.Ok(await getExpenses.GetAsync()));

app.MapDelete("/expenses/{id:guid}", async Task<IResult> (
	Guid id,
	IGetExpenses getExpenses,
	IDeleteExpense deleteExpense) =>
{
	var expense = (await getExpenses.GetAsync())
		.FirstOrDefault(item => item.Id == id);

	if (expense is null)
	{
		return Results.NotFound(new { error = $"Expense '{id}' was not found." });
	}

	await deleteExpense.DeleteAsync(expense);
	return Results.NoContent();
});

app.Run();
