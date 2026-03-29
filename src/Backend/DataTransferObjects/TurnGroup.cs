using QueuingSystem.Backend.Models;

namespace QueuingSystem.Backend.DataTransferObjects;

public class TurnGroup
{
    public required string Role { get; init; }
    public required IEnumerable<Turn> Turns { get; init; }
}
