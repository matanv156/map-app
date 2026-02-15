// MongoDB sample data script for MapAppDb
db = db.getSiblingDB("MapAppDb");

// Sample Polygons (GeoJSON Polygon geometry)
const polygons = [
  {
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [34.7517, 32.0818],
          [34.77, 32.0818],
          [34.77, 32.095],
          [34.7517, 32.095],
          [34.7517, 32.0818],
        ],
      ],
    },
    name: "Tel Aviv City Center",
    description:
      "The vibrant heart of Tel Aviv with shops, restaurants, and cultural venues",
    createdAt: new Date("2026-01-15T10:30:00Z"),
  },
  {
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [35.2137, 31.7683],
          [35.24, 31.7683],
          [35.24, 31.79],
          [35.2137, 31.79],
          [35.2137, 31.7683],
        ],
      ],
    },
    name: "Jerusalem Old City",
    description:
      "Historic walled city with religious and archaeological significance",
    createdAt: new Date("2026-01-16T14:45:00Z"),
  },
  {
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [34.9628, 32.8193],
          [34.98, 32.8193],
          [34.98, 32.835],
          [34.9628, 32.835],
          [34.9628, 32.8193],
        ],
      ],
    },
    name: "Haifa Downtown",
    description:
      "Coastal city known for beautiful views and cultural institutions",
    createdAt: new Date("2026-01-17T09:20:00Z"),
  },
  {
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [34.9517, 29.5581],
          [34.97, 29.5581],
          [34.97, 29.575],
          [34.9517, 29.575],
          [34.9517, 29.5581],
        ],
      ],
    },
    name: "Eilat Resort Area",
    description: "Southernmost resort city famous for diving and water sports",
    createdAt: new Date("2026-01-18T11:15:00Z"),
  },
];

// Sample MapObjects (GeoJSON Point geometry)
const mapObjects = [
  {
    geometry: {
      type: "Point",
      coordinates: [34.7682, 32.0853],
    },
    name: "Rabin Square",
    description:
      "Major public square serving as a focal point for protests and celebrations",
    symbolType: "Landmark",
    createdAt: new Date("2026-01-15T10:30:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [34.7711, 32.0808],
    },
    name: "Tel Aviv Beach",
    description:
      "Beautiful Mediterranean coastline perfect for swimming and beach activities",
    symbolType: "Beach",
    createdAt: new Date("2026-01-15T11:00:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [35.2364, 31.7683],
    },
    name: "Western Wall",
    description:
      "Sacred Jewish site and the most important pilgrimage destination",
    symbolType: "Historical",
    createdAt: new Date("2026-01-16T14:45:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [35.2346, 31.7765],
    },
    name: "Dome of the Rock",
    description: "Iconic Islamic shrine with distinctive golden dome",
    symbolType: "Monument",
    createdAt: new Date("2026-01-16T15:30:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [34.9733, 32.8193],
    },
    name: "Bahai Gardens",
    description: "Terraced Persian gardens with stunning views of the city",
    symbolType: "Garden",
    createdAt: new Date("2026-01-17T09:20:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [34.9628, 32.8245],
    },
    name: "Stella Maris Carmelite Monastery",
    description:
      "Historic monastery perched on Mount Carmel overlooking the sea",
    symbolType: "Historical",
    createdAt: new Date("2026-01-17T10:00:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [34.9575, 29.5508],
    },
    name: "Eilat Underwater Observatory",
    description:
      "Unique marine research facility offering underwater viewing of coral reefs",
    symbolType: "Museum",
    createdAt: new Date("2026-01-18T11:15:00Z"),
  },
  {
    geometry: {
      type: "Point",
      coordinates: [34.9628, 29.5581],
    },
    name: "Red Sea Coral Reef",
    description:
      "World-class coral reef ecosystem with vibrant marine biodiversity",
    symbolType: "Nature",
    createdAt: new Date("2026-01-18T12:00:00Z"),
  },
];

// Insert sample data
const polygonResult = db.Polygons.insertMany(polygons);
const mapObjectResult = db.MapObjects.insertMany(mapObjects);

print("✓ Sample data inserted successfully!");
print(`✓ Inserted ${polygonResult.insertedIds.length} polygons`);
print(`✓ Inserted ${mapObjectResult.insertedIds.length} map objects`);
print("\nSample data includes:");
print("  - Polygons: Tel Aviv, Jerusalem, Haifa, Eilat");
print(
  "  - Map Objects: Landmarks, Beaches, Historical & Religious sites, Nature reserves",
);
