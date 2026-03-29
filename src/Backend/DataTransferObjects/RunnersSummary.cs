namespace QueuingSystem.Backend.DataTransferObjects;

public class RunnersSummary
{
    public required int TotalRunners { get; init; }
    public required IEnumerable<RunnerGroup> RunnersByRole { get; init; }
}
