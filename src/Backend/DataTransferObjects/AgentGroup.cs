using QueuingSystem.Backend.Models;

namespace QueuingSystem.Backend.DataTransferObjects;

public class AgentGroup
{
    public required string Role { get; init; }
    public required IEnumerable<Agent> Agents { get; init; }
}
