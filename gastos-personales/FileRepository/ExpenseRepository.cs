using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace FileRepository;

public class ExpenseRepository : IRepository
{
    private readonly List<Expense> _expenses = [];

    public Task AddAsync(Expense expense)
    {
        ArgumentNullException.ThrowIfNull(expense);

        _expenses.Add(expense);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Expense>> GetAsync()
    {
        IReadOnlyList<Expense> expenses = _expenses.ToArray();
        return Task.FromResult(expenses);
    }

    public Task DeleteAsync(Expense expense)
    {
        ArgumentNullException.ThrowIfNull(expense);

        _expenses.RemoveAll(existingExpense => existingExpense.Id == expense.Id);
        return Task.CompletedTask;
    }
}