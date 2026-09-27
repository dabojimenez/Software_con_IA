using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.SecundaryPort;

public interface IRepository
{
    Task AddAsync(Expense expense);

    Task<IReadOnlyList<Expense>> GetAsync();

    Task DeleteAsync(Expense expense);
}