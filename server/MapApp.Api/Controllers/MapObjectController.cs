using MapApp.Api.DTOs;
using MapApp.Api.Models;
using MapApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;

namespace MapApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapObjectController : ControllerBase
{
    private readonly ILogger<MapObjectController> _logger;
    private readonly IMapObjectService _mapObjectService;

    public MapObjectController(ILogger<MapObjectController> logger, IMapObjectService mapObjectService)
    {
        _logger = logger;
        _mapObjectService = mapObjectService;
    }

    [HttpGet("mapObjects")]
    public async Task<IActionResult> GetMapObjects()
    {
        try
        {
            var mapObjects = await _mapObjectService.GetAllAsync();
            var count = mapObjects.Count();
            var items = mapObjects.Select(m => new MapObjectDto
            {
                Id = m.Id.ToString(),
                Name = m.Name,
                Description = m.Description,
                Geometry = ConvertToPointDto(m.Geometry),
                SymbolType = m.SymbolType
            }).ToList();
            
            return Ok(new
            {
                status = "success",
                count = count,
                items = items
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving map objects");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while retrieving map objects");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpGet("mapObject/{id}")]
    public async Task<IActionResult> GetMapObject(string id)
    {
        try
        {
            var mapObject = await _mapObjectService.GetByIdAsync(id);
            if (mapObject == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Map object not found"
                });
            }

            return Ok(new MapObjectDto
            {
                Id = mapObject.Id.ToString(),
                Name = mapObject.Name,
                Description = mapObject.Description,
                Geometry = ConvertToPointDto(mapObject.Geometry),
                SymbolType = mapObject.SymbolType
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving map object with ID {Id}", id);
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while retrieving map object with ID {Id}", id);
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpPost("addMapObject")]
    public async Task<IActionResult> AddMapObject(CreateMapObjectDto mapObjectDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(new
            {
                status = "error",
                message = "Validation failed",
                errors = errors
            });
        }

        try
        {
            var mapObject = ConvertToMapObject(mapObjectDto);
            mapObject = await _mapObjectService.CreateAsync(mapObject);
            return Ok(new
            {
                status = "success",
                message = "Map object added successfully",
                mapObject = new MapObjectDto
                {
                    Id = mapObject.Id.ToString(),
                    Name = mapObject.Name,
                    Description = mapObject.Description,
                    Geometry = ConvertToPointDto(mapObject.Geometry),
                    SymbolType = mapObject.SymbolType
                }
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while creating map object");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid map object data provided");
            return BadRequest(new
            {
                status = "error",
                message = "Invalid map object data"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while creating map object");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpPut("updateMapObject")]
    public async Task<IActionResult> UpdateMapObject(MapObjectDto mapObjectDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(new
            {
                status = "error",
                message = "Validation failed",
                errors = errors
            });
        }

        try
        {
            var mapObject = await _mapObjectService.GetByIdAsync(mapObjectDto.Id);
            if (mapObject == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Map object not found"
                });
            }
            mapObject.Name = mapObjectDto.Name;
            mapObject.Description = mapObjectDto.Description;
            mapObject.Geometry = ConvertToGeoJsonPoint(mapObjectDto.Geometry);
            mapObject.SymbolType = mapObjectDto.SymbolType;
            mapObject = await _mapObjectService.UpdateAsync(mapObject);
            return Ok(new
            {
                status = "success",
                message = "Map object updated successfully",
                mapObject = new MapObjectDto
                {
                    Id = mapObject.Id.ToString(),
                    Name = mapObject.Name,
                    Description = mapObject.Description,
                    Geometry = ConvertToPointDto(mapObject.Geometry),
                    SymbolType = mapObject.SymbolType
                }
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while updating map object");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid map object data provided");
            return BadRequest(new
            {
                status = "error",
                message = "Invalid map object data"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while updating map object");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpDelete("deleteMapObject/{id}")]
    public async Task<IActionResult> DeleteMapObject(string id)
    {
        try
        {
            await _mapObjectService.DeleteAsync(id);
            return Ok(new
            {
                status = "success",
                message = "Map object deleted successfully"
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while deleting map object");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while deleting map object");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    private MapObject ConvertToMapObject(CreateMapObjectDto mapObjectDto)
    {
        var geoJsonPoint = ConvertToGeoJsonPoint(mapObjectDto.Geometry);
        return new MapObject
        {
            Name = mapObjectDto.Name,
            Geometry = geoJsonPoint,
            SymbolType = mapObjectDto.SymbolType
        };
    }

    private GeoJsonPoint<GeoJson2DGeographicCoordinates> ConvertToGeoJsonPoint(PointDto pointDto)
    {
        var coordinates = new GeoJson2DGeographicCoordinates(pointDto.Coordinates[0], pointDto.Coordinates[1]);
        return new GeoJsonPoint<GeoJson2DGeographicCoordinates>(coordinates);
    }

    private PointDto ConvertToPointDto(GeoJsonPoint<GeoJson2DGeographicCoordinates> point)
    {
        return new PointDto
        {
            Type = "Point",
            Coordinates = new[] { point.Coordinates.Longitude, point.Coordinates.Latitude }
        };
    }
}
