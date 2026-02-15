using MapApp.Api.DTOs;
using MapApp.Api.Models;
using MapApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;

namespace MapApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PolygonController : ControllerBase
{
    private readonly ILogger<PolygonController> _logger;
    private readonly IPolygonService _polygonService;

    public PolygonController(ILogger<PolygonController> logger, IPolygonService polygonService)
    {
        _logger = logger;
        _polygonService = polygonService;
    }

    [HttpGet("polygons")]
    public async Task<IActionResult> GetPolygons()
    {
        try
        {
            var polygons = await _polygonService.GetAllAsync();
            var count = polygons.Count();
            var items = polygons.Select(p => new PolygonDto
            {
                Id = p.Id.ToString(),
                Name = p.Name,
                Description = p.Description,
                Geometry = ConvertToGeometryDto(p.Geometry)
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
            _logger.LogError(ex, "Database error while retrieving polygons");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while retrieving polygons");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpGet("polygon/{id}")]
    public async Task<IActionResult> GetPolygon(string id)
    {
        try
        {
            var polygon = await _polygonService.GetByIdAsync(id);
            if (polygon == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Polygon not found"
                });
            }

            return Ok(new PolygonDto
            {
                Id = polygon.Id.ToString(),
                Name = polygon.Name,
                Description = polygon.Description,
                Geometry = ConvertToGeometryDto(polygon.Geometry)
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while retrieving polygon with ID {Id}", id);
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while retrieving polygon with ID {Id}", id);
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpPost("addPolygon")]
    public async Task<IActionResult> AddPolygon(CreatePolygonDto polygonDto)
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
            var polygon = ConvertToPolygon(polygonDto);
            polygon = await _polygonService.CreateAsync(polygon);
            return Ok(new
            {
                status = "success",
                message = "Polygon added successfully",
                polygon = new PolygonDto
                {
                    Id = polygon.Id.ToString(),
                    Name = polygon.Name,
                    Description = polygon.Description,
                    Geometry = ConvertToGeometryDto(polygon.Geometry)
                }
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while creating polygon");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid polygon data provided");
            return BadRequest(new
            {
                status = "error",
                message = "Invalid polygon data"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while creating polygon");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpPut("updatePolygon")]
    public async Task<IActionResult> UpdatePolygon(PolygonDto polygonDto)
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
            var polygon = await _polygonService.GetByIdAsync(polygonDto.Id);
            if (polygon == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Polygon not found"
                });
            }
            polygon.Name = polygonDto.Name;
            polygon.Description = polygonDto.Description;
            polygon.Geometry = ConvertToGeoJsonPolygon(polygonDto.Geometry);
            polygon = await _polygonService.UpdateAsync(polygon);
            return Ok(new
            {
                status = "success",
                message = "Polygon updated successfully",
                polygon = new PolygonDto
                {
                    Id = polygon.Id.ToString(),
                    Name = polygon.Name,
                    Description = polygon.Description,
                    Geometry = ConvertToGeometryDto(polygon.Geometry)
                }
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while updating polygon");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid polygon data provided");
            return BadRequest(new
            {
                status = "error",
                message = "Invalid polygon data"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while updating polygon");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    [HttpDelete("deletePolygon/{id}")]
    public async Task<IActionResult> DeletePolygon(string id)
    {
        try
        {
            await _polygonService.DeleteAsync(id);
            return Ok(new
            {
                status = "success",
                message = "Polygon deleted successfully"
            });
        }
        catch (MongoException ex)
        {
            _logger.LogError(ex, "Database error while deleting polygon");
            return StatusCode(503, new
            {
                status = "error",
                message = "Database service unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while deleting polygon");
            return StatusCode(500, new
            {
                status = "error",
                message = "An unexpected error occurred"
            });
        }
    }

    private Polygon ConvertToPolygon(CreatePolygonDto polygonDto)
    {
        var geoJsonPolygon = ConvertToGeoJsonPolygon(polygonDto.Geometry);
        return new Polygon
        {
            Name = polygonDto.Name,
            Description = polygonDto.Description,
            Geometry = geoJsonPolygon
        };
    }

    private GeoJsonPolygon<GeoJson2DGeographicCoordinates> ConvertToGeoJsonPolygon(GeometryDto geometryDto)
    {
        var exteriorRingCoords = geometryDto.Coordinates[0]
            .Select(coord => new GeoJson2DGeographicCoordinates(coord[0], coord[1]))
            .ToList();
        
        var exteriorRing = new GeoJsonLinearRingCoordinates<GeoJson2DGeographicCoordinates>(exteriorRingCoords);
        
        var holes = geometryDto.Coordinates.Skip(1)
            .Select(ring => new GeoJsonLinearRingCoordinates<GeoJson2DGeographicCoordinates>(
                ring.Select(coord => new GeoJson2DGeographicCoordinates(coord[0], coord[1])).ToList()
            ))
            .ToList();

        var geoJsonPolygon = holes.Any()
            ? new GeoJsonPolygon<GeoJson2DGeographicCoordinates>(
                new GeoJsonPolygonCoordinates<GeoJson2DGeographicCoordinates>(exteriorRing, holes))
            : new GeoJsonPolygon<GeoJson2DGeographicCoordinates>(
                new GeoJsonPolygonCoordinates<GeoJson2DGeographicCoordinates>(exteriorRing));

        return geoJsonPolygon;
    }

    private GeometryDto ConvertToGeometryDto(GeoJsonPolygon<GeoJson2DGeographicCoordinates> polygon)
    {
        var coordinates = new List<double[][]>();
        
        var exteriorCoords = polygon.Coordinates.Exterior.Positions
            .Select(pos => new[] { pos.Longitude, pos.Latitude })
            .ToArray();
        coordinates.Add(exteriorCoords);
        
        foreach (var hole in polygon.Coordinates.Holes)
        {
            var holeCoords = hole.Positions
                .Select(pos => new[] { pos.Longitude, pos.Latitude })
                .ToArray();
            coordinates.Add(holeCoords);
        }

        return new GeometryDto
        {
            Type = "Polygon",
            Coordinates = coordinates.ToArray()
        };
    }
}