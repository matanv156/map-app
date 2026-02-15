# Map Application

A full-stack geospatial application for managing polygons and map objects with real-time visualization on an interactive map.

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Leaflet** for interactive mapping
- **React-Leaflet** for React integration
- **Leaflet-Draw** for polygon drawing
- **Zustand** for state management
- **Axios** for API communication
- **Vite** for build tooling
- **TailwindCSS 4** for styling

### Backend

- **ASP.NET Core 8.0** REST API
- **MongoDB** for data storage
- **GeoJSON** for geospatial data

## Features

- 🗺️ **Interactive Map**: View and interact with geographic features using Leaflet
- 🔷 **Polygon Management**: Draw, edit, save, and delete polygons with real-time visualization
- 📍 **Object Management**: Add, edit, and delete map objects (markers) with customizable types
- 🎨 **Themed Icons**: Different emoji icons based on object types (Landmark, Beach, Historical, Monument, Garden, Museum, Nature)
- 📋 **Data Overview**: Table view of all polygons and objects with descriptions
- 💾 **Persistent Storage**: All data stored in MongoDB with validation
- 🔄 **Real-time Updates**: Automatic data refresh after CRUD operations

## Project Structure

```
map-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # TypeScript type definitions
│   │   └── api/            # Axios client configuration
│   └── package.json
├── server/                 # ASP.NET Core API
│   └── MapApp.Api/
│       ├── Controllers/    # API endpoints
│       ├── Services/       # Business logic
│       ├── Models/         # Data models
│       ├── DTOs/           # Data transfer objects
│       └── Program.cs      # Application setup
└── database/               # MongoDB setup scripts
    ├── init-db.js          # Database initialization
    └── sample-data.js      # Sample data
```

## Getting Started

### Prerequisites

- Node.js 18+
- .NET 8.0 SDK
- MongoDB 4.0+

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd server/MapApp.Api
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5098`

### Database Setup

```bash
cd database
mongosh < init-db.js
mongosh < sample-data.js
```

## API Endpoints

### Polygons

- `GET /api/polygon/polygons` - Get all polygons
- `GET /api/polygon/polygon/{id}` - Get specific polygon
- `POST /api/polygon/addPolygon` - Create polygon
- `PUT /api/polygon/updatePolygon` - Update polygon
- `DELETE /api/polygon/deletePolygon/{id}` - Delete polygon

### Map Objects

- `GET /api/mapobject/mapobjects` - Get all objects
- `GET /api/mapobject/mapobject/{id}` - Get specific object
- `POST /api/mapobject/addMapObject` - Create object
- `PUT /api/mapobject/updateMapObject` - Update object
- `DELETE /api/mapobject/deleteMapObject/{id}` - Delete object

## Usage

1. **Drawing Polygons**: Click "Add Polygon" and draw on the map
2. **Adding Objects**: Click "Add Object" to place markers with custom types
3. **Editing**: Click any polygon or marker on the map to edit
4. **Descriptions**: Add descriptive text to any polygon or object
5. **Data View**: Check the "Map Data" panel for a table of all features

## Object Types

- **L (Landmark)** - Red icon for important landmarks
- **B (Beach)** - Cyan icon for beach locations
- **H (Historical)** - Orange icon for historical sites
- **M (Monument)** - Purple icon for monuments
- **G (Garden)** - Green icon for gardens
- **U (Museum)** - Blue icon for museums
- **N (Nature)** - Yellow-green icon for nature reserves

## Data Model

### Polygon

```json
{
  "id": "ObjectId",
  "name": "string",
  "description": "string",
  "geometry": {
    "type": "Polygon",
    "coordinates": "[[[lon, lat], ...]]"
  },
  "createdAt": "Date"
}
```

### MapObject

```json
{
  "id": "ObjectId",
  "name": "string",
  "description": "string",
  "geometry": {
    "type": "Point",
    "coordinates": "[lon, lat]"
  },
  "symbolType": "string",
  "createdAt": "Date"
}
```

## Development

### Building

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server/MapApp.Api
dotnet build
```

### Code Quality

- TypeScript strict mode enabled
- ESLint for frontend linting
- Clean architecture with separation of concerns
- No console logs in production code

## License

This project is part of an interview task demonstration.
