namespace ExpenseAPI.Contracts;

/// <summary>Request body for creating a category.</summary>
public sealed record CreateCategoryRequest
{
    /// <summary>Gets the category name.</summary>
    public required string Name { get; init; }
}
