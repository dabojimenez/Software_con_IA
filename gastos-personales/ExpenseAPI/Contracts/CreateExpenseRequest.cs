namespace ExpenseAPI.Contracts;

public sealed record CreateExpenseRequest(
    string Concept,
    decimal Amount,
    DateOnly Date,
    string Currency,
    string? Note = null);