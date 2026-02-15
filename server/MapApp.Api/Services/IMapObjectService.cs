using MapApp.Api.Models;

namespace MapApp.Api.Services;

public interface IMapObjectService
{
    Task<List<MapObject>> GetAllAsync();
    Task<MapObject> GetByIdAsync(string id);
    Task<MapObject> CreateAsync(MapObject mapObject);
    Task<MapObject> UpdateAsync(MapObject mapObject);
    Task DeleteAsync(string id);
}