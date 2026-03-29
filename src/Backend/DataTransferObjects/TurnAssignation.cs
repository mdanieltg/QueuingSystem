namespace QueuingSystem.Backend.DataTransferObjects;

public class TurnAssignation
{
    public required string Turn { get; init; }
    public required string StationType { get; init; }
    public required string Station { get; init; }
}
