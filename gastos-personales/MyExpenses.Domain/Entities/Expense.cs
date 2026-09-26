using MyExpenses.Domain.Exceptions;

namespace MyExpenses.Domain.Entities;

public class Expense
{
    public Guid Id { get; }

    public string Concept { get; }

    public string? Note { get; }

    public decimal Amount { get; }

    public DateOnly Date { get; }

    public string Currency { get; }

    public Expense(
        string concept,
        decimal amount,
        DateOnly date,
        string currency,
        string? note = null)
    {
        if (string.IsNullOrWhiteSpace(concept))
        {
            throw new DomainException("Expense concept is required.");
        }

        if (amount <= 0)
        {
            throw new DomainException("Expense amount must be greater than zero.");
        }

        if (date == default)
        {
            throw new DomainException("Expense date is required.");
        }

        if (string.IsNullOrWhiteSpace(currency))
        {
            throw new DomainException("Expense currency is required.");
        }

        Id = Guid.NewGuid();
        Concept = concept.Trim();
        Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
        Amount = amount;
        Date = date;
        Currency = currency.Trim().ToUpperInvariant();
    }
}