using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.PrimaryPort.Expenses;

public interface IRegisterExpense
{
    Task RegisterAsync(Expense expense);
}