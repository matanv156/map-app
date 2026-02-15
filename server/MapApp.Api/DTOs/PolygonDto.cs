using System.ComponentModel.DataAnnotations;
using MongoDB.Driver.GeoJsonObjectModel;

namespace MapApp.Api.DTOs;

public class PolygonDto
{
    [Required]
    public string Id { get; set; } = null!;

    [Required]
    public GeometryDto Geometry { get; set; } = null!;

    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }
}

public class CreatePolygonDto
{
    [Required]
    public GeometryDto Geometry { get; set; } = null!;

    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }
}