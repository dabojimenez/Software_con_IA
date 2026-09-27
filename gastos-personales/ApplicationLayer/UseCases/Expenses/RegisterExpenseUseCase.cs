using ApplicationLayer.Ports.PrimaryPort.Expenses;
using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace ApplicationLayer.UseCases.Expenses;

public class RegisterExpenseUseCase : IRegisterExpense
{
    private readonly IRepository _repository;

    public RegisterExpenseUseCase(IRepository repository)
    {
        _repository = repository;
    }

    public Task RegisterAsync(Expense expense)
    {
        return _repository.AddAsync(expense);
    }
}