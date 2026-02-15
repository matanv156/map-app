using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MapApp.Api.Models;
using MapApp.Api.Configuration;

namespace MapApp.Api.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    private readonly MongoDbSettings _settings;
    private readonly ILogger<MongoDbContext> _logger;
    private readonly bool _autoCreateIndexes;

    public MongoDbContext(
        IMongoClient client,
        IOptions<MongoDbSettings> settings,
        ILogger<MongoDbContext> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        _autoCreateIndexes = true;

        _logger.LogInformation("Connecting to MongoDB database: {DatabaseName}", _settings.DatabaseName);
        _database = client.GetDatabase(_settings.DatabaseName);
        _logger.LogInformation("Successfully connected to database: {DatabaseName}", _settings.DatabaseName);

        if (_autoCreateIndexes)
        {
            CreateCriticalIndexes();
        }
    }

    public IMongoCollection<Polygon> Polygons =>
        _database.GetCollection<Polygon>(_settings.PolygonsCollectionName);

    public IMongoCollection<MapObject> Objects =>
        _database.GetCollection<MapObject>(_settings.ObjectsCollectionName);

    private void CreateCriticalIndexes()
    {
        try
        {
            _logger.LogInformation("Creating critical geospatial indexes...");

            var polygonGeoIndex = Builders<Polygon>.IndexKeys
                .Geo2DSphere(p => p.Geometry);

            Polygons.Indexes.CreateOne(
                new CreateIndexModel<Polygon>(polygonGeoIndex));

            _logger.LogInformation("Created geospatial index for Polygons collection");

            var objectGeoIndex = Builders<MapObject>.IndexKeys
                .Geo2DSphere(o => o.Geometry);

            Objects.Indexes.CreateOne(
                new CreateIndexModel<MapObject>(objectGeoIndex));

            _logger.LogInformation("Created geospatial index for MapObjects collection");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to create indexes. Ensure init-db.js has been run during database setup.");
        }
    }
}
