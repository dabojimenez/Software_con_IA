using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.PrimaryPort.Expenses;

public interface IDeleteExpense
{
    Task DeleteAsync(Expense expense);
}