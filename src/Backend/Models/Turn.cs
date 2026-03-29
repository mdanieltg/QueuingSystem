namespace QueuingSystem.Backend.Models;

public class Turn
{
    public Guid Id { get; init; }
    public required string Code { get; init; }
    public required string Role { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? CompletedAt { get; set; }
    public TurnStatus Status { get; set; }
}
