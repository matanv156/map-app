using MongoDB.Driver;
using MongoDB.Bson;
using MapApp.Api.Data;
using MapApp.Api.Models;
using MapApp.Api.Services;

namespace MapApp.Api.Services;

public class MapObjectService : IMapObjectService
{
    private readonly MongoDbContext _context;
    private readonly ILogger<MapObjectService> _logger;

    public MapObjectService(MongoDbContext context, ILogger<MapObjectService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<MapObject>> GetAllAsync()
    {
        try
        {
            _logger.LogInformation("Retrieving all map objects from database");
            var mapObjects = await _context.Objects
                .Find(_ => true)
                .ToListAsync();
            _logger.LogInformation("Successfully retrieved {MapObjectCount} map objects", mapObjects.Count);
            return mapObjects;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving map objects");
            throw;
        }
    }

    public async Task<MapObject> GetByIdAsync(string id)
    {
        try
        {
            _logger.LogInformation("Retrieving map object with ID: {MapObjectId}", id);
            var objectId = ObjectId.Parse(id);
            var mapObject = await _context.Objects
                .Find(o => o.Id == objectId)
                .FirstOrDefaultAsync();

            if (mapObject == null)
            {
                _logger.LogWarning("Map object with ID {MapObjectId} not found", id);
            }
            else
            {
                _logger.LogInformation("Successfully retrieved map object with ID: {MapObjectId}", id);
            }

            return mapObject;
        }
        catch (FormatException ex)
        {
            _logger.LogWarning(ex, "Invalid map object ID format: {MapObjectId}", id);
            throw;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving map object with ID: {MapObjectId}", id);
            throw;
        }
    }

    public async Task<MapObject> CreateAsync(MapObject mapObject)
    {
        try
        {
            _logger.LogInformation("Creating new map object with name: {MapObjectName} and symbolType: {SymbolType}", 
                mapObject.Name, mapObject.SymbolType);
            await _context.Objects.InsertOneAsync(mapObject);
            _logger.LogInformation("Successfully created map object with ID: {MapObjectId}", mapObject.Id);
            return mapObject;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while creating map object");
            throw;
        }
    }

    public async Task<MapObject> UpdateAsync(MapObject mapObject)
    {
        try
        {
            _logger.LogInformation("Updating map object with ID: {MapObjectId}", mapObject.Id);
            var result = await _context.Objects.ReplaceOneAsync(o => o.Id == mapObject.Id, mapObject);
            
            if (result.MatchedCount == 0)
            {
                _logger.LogWarning("Map object with ID {MapObjectId} not found for update", mapObject.Id);
            }
            else
            {
                _logger.LogInformation("Successfully updated map object with ID: {MapObjectId}", mapObject.Id);
            }
            return mapObject;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while updating map object with ID: {MapObjectId}", mapObject.Id);
            throw;
        }
    }

    public async Task DeleteAsync(string id)
    {
        try
        {
            _logger.LogInformation("Deleting map object with ID: {MapObjectId}", id);
            var objectId = ObjectId.Parse(id);
            var result = await _context.Objects.DeleteOneAsync(o => o.Id == objectId);
            
            if (result.DeletedCount == 0)
            {
                _logger.LogWarning("Map object with ID {MapObjectId} not found for deletion", id);
            }
            else
            {
                _logger.LogInformation("Successfully deleted map object with ID: {MapObjectId}", id);
            }
        }
        catch (FormatException ex)
        {
            _logger.LogWarning(ex, "Invalid map object ID format: {MapObjectId}", id);
            throw;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while deleting map object with ID: {MapObjectId}", id);
            throw;
        }
    }
}