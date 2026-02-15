using MongoDB.Driver;
using MongoDB.Bson;
using MapApp.Api.Data;
using MapApp.Api.Models;

namespace MapApp.Api.Services;

public class PolygonService : IPolygonService
{
    private readonly MongoDbContext _context;
    private readonly ILogger<PolygonService> _logger;

    public PolygonService(MongoDbContext context, ILogger<PolygonService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Polygon>> GetAllAsync()
    {
        try
        {
            _logger.LogInformation("Retrieving all polygons from database");
            var polygons = await _context.Polygons
                .Find(_ => true)
                .ToListAsync();
            _logger.LogInformation("Successfully retrieved {PolygonCount} polygons", polygons.Count);
            return polygons;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving polygons");
            throw;
        }
    }

    public async Task<Polygon> GetByIdAsync(string id)
    {
        try
        {
            _logger.LogInformation("Retrieving polygon with ID: {PolygonId}", id);
            var objectId = ObjectId.Parse(id);
            var polygon = await _context.Polygons
                .Find(p => p.Id == objectId)
                .FirstOrDefaultAsync();

            if (polygon == null)
            {
                _logger.LogWarning("Polygon with ID {PolygonId} not found", id);
            }
            else
            {
                _logger.LogInformation("Successfully retrieved polygon with ID: {PolygonId}", id);
            }

            return polygon;
        }
        catch (FormatException ex)
        {
            _logger.LogWarning(ex, "Invalid polygon ID format: {PolygonId}", id);
            throw;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving polygon with ID: {PolygonId}", id);
            throw;
        }
    }

    public async Task<Polygon> CreateAsync(Polygon polygon)
    {
        try
        {
            _logger.LogInformation("Creating new polygon with name: {PolygonName}", polygon.Name);
            await _context.Polygons.InsertOneAsync(polygon);
            _logger.LogInformation("Successfully created polygon with ID: {PolygonId}", polygon.Id);
            return polygon;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while creating polygon");
            throw;
        }
    }

    public async Task<Polygon> UpdateAsync(Polygon polygon)
    {
        try
        {
            _logger.LogInformation("Updating polygon with ID: {PolygonId}", polygon.Id);
            var result = await _context.Polygons.ReplaceOneAsync(p => p.Id == polygon.Id, polygon);
            
            if (result.MatchedCount == 0)
            {
                _logger.LogWarning("Polygon with ID {PolygonId} not found for update", polygon.Id);
            }
            else
            {
                _logger.LogInformation("Successfully updated polygon with ID: {PolygonId}", polygon.Id);
            }
            return polygon;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while updating polygon with ID: {PolygonId}", polygon.Id);
            throw;
        }
    }

    public async Task DeleteAsync(string id)
    {
        try
        {
            _logger.LogInformation("Deleting polygon with ID: {PolygonId}", id);
            var objectId = ObjectId.Parse(id);
            var result = await _context.Polygons.DeleteOneAsync(p => p.Id == objectId);
            
            if (result.DeletedCount == 0)
            {
                _logger.LogWarning("Polygon with ID {PolygonId} not found for deletion", id);
            }
            else
            {
                _logger.LogInformation("Successfully deleted polygon with ID: {PolygonId}", id);
            }
        }
        catch (FormatException ex)
        {
            _logger.LogWarning(ex, "Invalid polygon ID format: {PolygonId}", id);
            throw;
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while deleting polygon with ID: {PolygonId}", id);
            throw;
        }
    }
}