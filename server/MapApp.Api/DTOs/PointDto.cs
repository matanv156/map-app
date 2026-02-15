namespace MapApp.Api.DTOs;

public class PointDto
{
    public string Type { get; set; } = "Point";
    public double[] Coordinates { get; set; } = null!;
}
