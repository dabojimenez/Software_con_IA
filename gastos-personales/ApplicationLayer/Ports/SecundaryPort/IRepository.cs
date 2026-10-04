namespace ApplicationLayer.Ports.SecundaryPort;

public interface IRepository<T>
{
    Task AddAsync(T entity);

    Task<IReadOnlyList<T>> GetAsync();

    Task DeleteAsync(T entity);
}