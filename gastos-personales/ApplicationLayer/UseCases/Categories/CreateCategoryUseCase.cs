using ApplicationLayer.Ports.PrimaryPort.Categories;
using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace ApplicationLayer.UseCases.Categories;

public class CreateCategoryUseCase : ICreateCategory
{
    private readonly IRepository<Category> _repository;

    public CreateCategoryUseCase(IRepository<Category> repository)
    {
        _repository = repository;
    }

    public Task CreateAsync(Category category)
    {
        return _repository.AddAsync(category);
    }
}
