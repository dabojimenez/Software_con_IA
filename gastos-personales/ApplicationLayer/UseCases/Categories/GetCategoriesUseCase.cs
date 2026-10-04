using ApplicationLayer.Ports.PrimaryPort.Categories;
using ApplicationLayer.Ports.SecundaryPort;
using MyExpenses.Domain.Entities;

namespace ApplicationLayer.UseCases.Categories;

public class GetCategoriesUseCase : IGetCategories
{
    private readonly IRepository<Category> _repository;

    public GetCategoriesUseCase(IRepository<Category> repository)
    {
        _repository = repository;
    }

    public Task<IReadOnlyList<Category>> GetAsync()
    {
        return _repository.GetAsync();
    }
}
