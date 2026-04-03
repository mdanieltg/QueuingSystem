namespace QueuingSystem.Backend.Hubs;

public interface ITurnClient
{
    Task TurnCreated();
    Task TurnAssigned(string turn, string type, string station);
}
