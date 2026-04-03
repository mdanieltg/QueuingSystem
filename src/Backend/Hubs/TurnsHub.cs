using Microsoft.AspNetCore.SignalR;
using QueuingSystem.Backend.DataTransferObjects;

namespace QueuingSystem.Backend.Hubs;

public class TurnsHub : Hub
{
    public async ValueTask TurnCreated() =>
        await Clients.All.SendAsync("turnCreated");

    public async ValueTask TurnAssigned(TurnAssignation assignation) =>
        await Clients.All.SendAsync("turnAssigned", assignation.Turn, assignation.Type, assignation.Station);
}
