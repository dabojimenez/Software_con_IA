using ApplicationLayer.Ports.PrimaryPort.Expenses;
using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace ApplicationLayer.UseCases.Expenses;

public class DeleteExpenseUseCase : IDeleteExpense
{
    private readonly IRepository _repository;

    public DeleteExpenseUseCase(IRepository repository)
    {
        _repository = repository;
    }

    public Task DeleteAsync(Expense expense)
    {
        return _repository.DeleteAsync(expense);
    }
}