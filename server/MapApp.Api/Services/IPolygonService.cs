using MapApp.Api.Models;

namespace MapApp.Api.Services;

public interface IPolygonService
{
    Task<List<Polygon>> GetAllAsync();
    Task<Polygon> GetByIdAsync(string id);
    Task<Polygon> CreateAsync(Polygon polygon);
    Task<Polygon> UpdateAsync(Polygon polygon);
    Task DeleteAsync(string id);
}