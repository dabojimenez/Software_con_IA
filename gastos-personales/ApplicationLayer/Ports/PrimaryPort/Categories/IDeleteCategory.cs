using MyExpenses.Domain.Entities;

namespace ApplicationLayer.Ports.PrimaryPort.Categories;

public interface IDeleteCategory
{
    Task DeleteAsync(Category category);
}
