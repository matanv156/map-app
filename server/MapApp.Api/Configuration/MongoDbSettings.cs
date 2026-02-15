namespace MapApp.Api.Configuration;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string PolygonsCollectionName { get; set; } = null!;
    public string ObjectsCollectionName { get; set; } = null!;
}