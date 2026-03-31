namespace QueuingSystem.Backend.DataTransferObjects;

public class AgentsSummary
{
    public required int TotalAgents { get; init; }
    public required IEnumerable<AgentGroup> AgentsByRole { get; init; }
}
