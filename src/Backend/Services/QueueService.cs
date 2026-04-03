using System.Collections.Concurrent;
using QueuingSystem.Backend.DataTransferObjects;
using QueuingSystem.Backend.Models;

namespace QueuingSystem.Backend.Services;

public class QueueService : IQueueService
{
    private readonly ConcurrentDictionary<Guid, Agent> _agents = new();
    private readonly ConcurrentQueue<TurnAssignation> _assignations = new();
    private readonly Lock _lock = new();
    private readonly ConcurrentBag<Turn> _turns = [];

    public Agent EnrollAgent(string role, string station)
    {
        lock (_lock)
        {
            if (_agents.Values.Any(r => r.Station == station && r.Role == role))
                throw new InvalidOperationException("Agent already enrolled at this station for this role.");

            Agent agent = new()
            {
                Id = Guid.NewGuid(),
                Role = role,
                Station = station,
                IsActive = false
            };

            _agents[agent.Id] = agent;
            return agent;
        }
    }

    public AgentsSummary GetAgentsSummary()
    {
        List<Agent> agentsList = _agents.Values.ToList();
        return new AgentsSummary
        {
            TotalAgents = agentsList.Count,
            AgentsByRole = agentsList
                .OrderBy(r => r.Station)
                .GroupBy(r => r.Role)
                .Select(g => new AgentGroup
                {
                    Role = g.Key,
                    Agents = g.ToList()
                })
        };
    }

    public Agent? GetAgent(Guid agentId)
    {
        _agents.TryGetValue(agentId, out Agent? agent);
        return agent;
    }

    public bool UnenrollAgent(Guid agentId)
    {
        lock (_lock)
        {
            if (!_agents.TryRemove(agentId, out Agent? agent))
                return false;

            CompleteCurrentTurn(agent);
            return true;
        }
    }

    public bool? ToggleAgentStatus(Guid agentId)
    {
        lock (_lock)
        {
            if (!_agents.TryGetValue(agentId, out Agent? agent))
                return null;

            if (agent.IsActive) CompleteCurrentTurn(agent);

            agent.IsActive = !agent.IsActive;
            return agent.IsActive;
        }
    }

    public Turn CreateTurn(string role)
    {
        var id = Guid.NewGuid();
        Turn turn = new()
        {
            Id = id,
            Code = id.ToString("N")[28..],
            Role = role,
            Status = TurnStatus.Created,
            CreatedAt = DateTime.UtcNow
        };

        _turns.Add(turn);
        return turn;
    }

    public TurnsSummary GetTurnsSummary(TurnStatus status)
    {
        List<Turn> filteredTurns = _turns
            .Where(t => t.Status == status)
            .OrderBy(t => t.CreatedAt)
            .ToList();

        return new TurnsSummary
        {
            TotalTurns = filteredTurns.Count,
            TurnsByRole = filteredTurns.GroupBy(t => t.Role)
                .Select(g => new TurnGroup
                {
                    Role = g.Key,
                    Turns = g.ToList()
                })
        };
    }

    public IEnumerable<TurnAssignation> GetAssignations()
    {
        return _assignations
            .TakeLast(10)
            .Reverse();
    }

    public TurnAssignation? AssignTurn(Guid agentId)
    {
        lock (_lock)
        {
            if (!_agents.TryGetValue(agentId, out Agent? runner))
                return null;

            if (!runner.IsActive)
                throw new InvalidOperationException("Runner is not active.");

            Turn? turn = _turns
                .Where(t => t.Role == runner.Role && t.Status == TurnStatus.Created)
                .OrderBy(t => t.CreatedAt)
                .FirstOrDefault();

            if (turn is null)
                return null;

            CompleteCurrentTurn(runner);

            turn.Status = TurnStatus.Assigned;
            runner.CurrentTurn = turn;

            var assignation = new TurnAssignation
            {
                Turn = turn.Code,
                Type = runner.Role,
                Station = runner.Station
            };

            _assignations.Enqueue(assignation);
            return assignation;
        }
    }

    private static void CompleteCurrentTurn(Agent agent)
    {
        if (agent.CurrentTurn == null) return;
        agent.CurrentTurn.Status = TurnStatus.Completed;
        agent.CurrentTurn.CompletedAt = DateTime.UtcNow;
        agent.CurrentTurn = null;
    }
}
