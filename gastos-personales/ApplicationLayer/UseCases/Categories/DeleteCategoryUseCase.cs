using ApplicationLayer.Ports.PrimaryPort.Categories;
using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace ApplicationLayer.UseCases.Categories;

public class DeleteCategoryUseCase : IDeleteCategory
{
    private readonly IRepository<Category> _repository;

    public DeleteCategoryUseCase(IRepository<Category> repository)
    {
        _repository = repository;
    }

    public Task DeleteAsync(Category category)
    {
        return _repository.DeleteAsync(category);
    }
}
