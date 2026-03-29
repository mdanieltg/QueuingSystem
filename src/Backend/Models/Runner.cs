namespace QueuingSystem.Backend.Models;

public class Runner
{
    public Guid Id { get; init; }
    public required string Role { get; init; }
    public required string Station { get; init; }
    public bool IsActive { get; set; }
    public Turn? CurrentTurn { get; set; }
}
