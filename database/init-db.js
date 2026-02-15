// MongoDB initialization script for MapAppDb

db = db.getSiblingDB("MapAppDb");

// Create Polygons collection with validator
db.createCollection("Polygons", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["geometry", "name"],
      properties: {
        _id: { bsonType: "objectId" },
        geometry: {
          bsonType: "object",
          description: "GeoJSON Polygon geometry",
        },
        name: {
          bsonType: "string",
          description: "Name of the polygon",
        },
        description: {
          bsonType: ["string", "null"],
          description: "Description of the polygon",
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp",
        },
      },
    },
  },
});

// Create MapObjects collection with validator
db.createCollection("MapObjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["geometry", "name"],
      properties: {
        _id: { bsonType: "objectId" },
        geometry: {
          bsonType: "object",
          description: "GeoJSON Point geometry",
        },
        name: {
          bsonType: "string",
          description: "Name of the map object",
        },
        description: {
          bsonType: ["string", "null"],
          description: "Description of the map object",
        },
        symbolType: {
          bsonType: "string",
          description: "Type of symbol/marker",
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp",
        },
      },
    },
  },
});

// Create 2dsphere indexes for geospatial queries
db.Polygons.createIndex({ geometry: "2dsphere" });
db.MapObjects.createIndex({ geometry: "2dsphere" });

// Optional: Create additional indexes for better query performance
db.Polygons.createIndex({ name: 1 });
db.Polygons.createIndex({ createdAt: -1 });

db.MapObjects.createIndex({ name: 1 });
db.MapObjects.createIndex({ createdAt: -1 });
db.MapObjects.createIndex({ symbolType: 1 });

print("✓ Database MapAppDb initialized successfully!");
print("✓ Collections created: Polygons, MapObjects");
print("✓ Geospatial indexes created for both collections");
