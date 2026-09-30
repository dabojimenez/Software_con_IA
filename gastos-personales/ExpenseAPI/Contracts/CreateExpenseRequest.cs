namespace ExpenseAPI.Contracts;

public sealed record CreateExpenseRequest(
    string Concept,
    decimal Amount,
    DateOnly Date,
    string Currency,
    Guid IdCategory,
    string? Note = null);