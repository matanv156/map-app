namespace MapApp.Api.DTOs;

public class GeometryDto
{
    public string Type { get; set; } = null!;
    public double[][][] Coordinates { get; set; } = null!;
}
