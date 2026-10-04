namespace ExpenseAPI.Contracts;

/// <summary>Category data returned by the API.</summary>
public sealed record CategoryResponse(Guid Id, string Name);
