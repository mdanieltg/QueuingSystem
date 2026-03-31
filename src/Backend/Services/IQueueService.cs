using QueuingSystem.Backend.DataTransferObjects;
using QueuingSystem.Backend.Models;

namespace QueuingSystem.Backend.Services;

public interface IQueueService
{
    Agent EnrollAgent(string role, string station);
    AgentsSummary GetAgentsSummary();
    Agent? GetAgent(Guid agentId);
    bool UnenrollAgent(Guid agentId);
    bool? ToggleAgentStatus(Guid agentId);
    Turn CreateTurn(string role);
    TurnsSummary GetTurnsSummary(TurnStatus status);
    IEnumerable<AssignationGroup> GetAssignations();
    TurnAssignation? AssignTurn(Guid agentId);
}
