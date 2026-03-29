namespace QueuingSystem.Backend.DataTransferObjects;

public class TurnsSummary
{
    public required int TotalTurns { get; init; }
    public required IEnumerable<TurnGroup> TurnsByRole { get; init; }
}
