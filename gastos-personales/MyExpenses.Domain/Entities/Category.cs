using MyExpenses.Domain.Exceptions;

namespace MyExpenses.Domain.Entities;

public class Category
{
    public Guid Id { get; }

    public string Name { get; }

    public Category(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Category name is required.");
        }

        if (name.Length > 100)
        {
            throw new DomainException("Category name must not exceed 100 characters.");
        }

        Id = Guid.NewGuid();
        Name = name.Trim();
    }
}
