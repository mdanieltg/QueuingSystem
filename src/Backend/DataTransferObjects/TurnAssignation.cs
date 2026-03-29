namespace QueuingSystem.Backend.DataTransferObjects;

public class TurnAssignation
{
    public required string Turn { get; init; }
    public required string Type { get; init; }
    public required string Station { get; init; }
}
