namespace QueuingSystem.Backend.DataTransferObjects;

public class AssignationGroup
{
    public required string Type { get; init; }
    public required IEnumerable<TurnAssignation> Assignations { get; init; }
}
