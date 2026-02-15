using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using MapApp.Api.Models;

namespace MapApp.Api.Configuration;

public static class BsonConfiguration
{
    public static void Configure()
    {
        if (!BsonClassMap.IsClassMapRegistered(typeof(Polygon)))
        {
            BsonClassMap.RegisterClassMap<Polygon>(cm =>
            {
                cm.AutoMap();
                cm.SetIdMember(cm.GetMemberMap(p => p.Id));
                cm.SetIgnoreExtraElements(true);
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(MapObject)))
        {
            BsonClassMap.RegisterClassMap<MapObject>(cm =>
            {
                cm.AutoMap();
                cm.SetIdMember(cm.GetMemberMap(o => o.Id));
                cm.SetIgnoreExtraElements(true);
            });
        }
    }
}
