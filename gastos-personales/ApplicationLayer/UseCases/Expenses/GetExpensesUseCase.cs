using ApplicationLayer.Ports.PrimaryPort.Expenses;
using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace ApplicationLayer.UseCases.Expenses;

public class GetExpensesUseCase : IGetExpenses
{
    private readonly IRepository _repository;

    public GetExpensesUseCase(IRepository repository)
    {
        _repository = repository;
    }

    public Task<IReadOnlyList<Expense>> GetAsync()
    {
        return _repository.GetAsync();
    }
}