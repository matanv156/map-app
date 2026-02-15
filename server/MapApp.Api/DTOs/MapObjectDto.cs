using System.ComponentModel.DataAnnotations;

namespace MapApp.Api.DTOs;

public class MapObjectDto
{
    [Required]
    public string Id { get; set; } = null!;

    [Required]
    public PointDto Geometry { get; set; } = null!;

    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(100, MinimumLength = 1)]
    public string SymbolType { get; set; } = "Marker";
}

public class CreateMapObjectDto
{
    [Required]
    public PointDto Geometry { get; set; } = null!;

    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string Name { get; set; } = null!;

    [StringLength(100, MinimumLength = 1)]
    public string SymbolType { get; set; } = "Marker";
}