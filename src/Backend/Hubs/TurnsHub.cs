using Microsoft.AspNetCore.SignalR;
using QueuingSystem.Backend.DataTransferObjects;

namespace QueuingSystem.Backend.Hubs;

public class TurnsHub : Hub<ITurnClient>
{
    public async ValueTask TurnCreated() =>
        await Clients.All.TurnCreated();

    public async ValueTask TurnAssigned(TurnAssignation assignation) =>
        await Clients.All.TurnAssigned(assignation.Turn, assignation.Type, assignation.Station);
}
