using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.PrimaryPort.Expenses;

public interface IGetExpenses
{
    Task<IReadOnlyList<Expense>> GetAsync();
}