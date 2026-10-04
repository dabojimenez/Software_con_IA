using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.PrimaryPort.Categories;

public interface ICreateCategory
{
    Task CreateAsync(Category category);
}
