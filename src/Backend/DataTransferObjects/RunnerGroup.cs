using QueuingSystem.Backend.Models;

namespace QueuingSystem.Backend.DataTransferObjects;

public class RunnerGroup
{
    public required string Role { get; init; }
    public required IEnumerable<Runner> Runners { get; init; }
}
