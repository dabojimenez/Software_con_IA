using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.PrimaryPort.Categories;

public interface IGetCategories
{
    Task<IReadOnlyList<Category>> GetAsync();
}
