# Copilot Instructions

## Project Shape

- This is a .NET 10 solution with four projects: `MyExpenses.Domain`, `ApplicationLayer`, `FileRepository`, and `ExpenseAPI`.
- Keep the hexagonal boundaries: domain rules belong in `MyExpenses.Domain`; use cases and primary/secondary ports belong in `ApplicationLayer`; `FileRepository` implements `IRepository`; `ExpenseAPI` is the composition root and HTTP adapter.
- Follow the existing C# conventions: English identifiers, file-scoped namespaces, nullable reference types, constructor injection, and asynchronous port/repository methods.
- The repository named `FileRepository` currently stores expenses in memory in a `List<Expense>`; it does not persist to disk. Do not assume data survives a process restart.
- `plan.md` describes intended scope and future work, not necessarily implemented behavior. Check the current code before treating a planned feature or rule as present.

## Workflow And Verification

- Work incrementally and stay within the behavior explicitly requested. Do not add users or authentication; neither is in scope.
- From this directory, build with `dotnet build MyExpenses.sln`.
- Run the API with `dotnet run --project ExpenseAPI/ExpenseAPI.csproj --launch-profile http`; the HTTP profile uses `http://localhost:5046`.
- Use `ExpenseAPI/ExpenseAPI.http` for manual endpoint checks and preserve `###` separators between requests. There is currently no test project in the solution, so do not report tests as run unless a test project is added and executed.
- When changing domain rules, keep validation in the domain entity and use `DomainException` for domain validation failures; map those failures at the API boundary as the existing endpoint does.

## Useful References

- [Project plan](../plan.md)
- [API composition root](../ExpenseAPI/Program.cs)
- [Domain entity](../MyExpenses.Domain/Entities/Expense.cs)
- [Repository implementation](../FileRepository/ExpenseRepository.cs)
- [HTTP request examples](../ExpenseAPI/ExpenseAPI.http)