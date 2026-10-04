using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace FileRepository;

public class CategoryRepository : IRepository<Category>
{
    private readonly List<Category> _categories = [];

    public Task AddAsync(Category category)
    {
        ArgumentNullException.ThrowIfNull(category);

        _categories.Add(category);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Category>> GetAsync()
    {
        IReadOnlyList<Category> categories = _categories.ToArray();
        return Task.FromResult(categories);
    }

    public Task DeleteAsync(Category category)
    {
        ArgumentNullException.ThrowIfNull(category);

        _categories.RemoveAll(existingCategory => existingCategory.Id == category.Id);
        return Task.CompletedTask;
    }
}
