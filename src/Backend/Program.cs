using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;
using QueuingSystem.Backend.Hubs;
using QueuingSystem.Backend.Models;
using QueuingSystem.Backend.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<IQueueService, QueueService>();

builder.Services.AddCors(options =>
{
    string[] origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

    options.AddDefaultPolicy(new CorsPolicyBuilder(origins)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .Build());
});

builder.Services.AddSignalR();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.MapHub<TurnsHub>("/ws/turns");

// API Key Middleware
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/ws"))
    {
        await next(context);
        return;
    }

    if (!context.Request.Headers.TryGetValue("X-API-KEY", out StringValues apiKey))
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.Headers.WWWAuthenticate = "ApiKey";
        return;
    }

    var configuration = context.RequestServices.GetRequiredService<IConfiguration>();
    Dictionary<string, string> allowedClients = configuration
                                                    .GetSection("ApiKey:AllowedClients")
                                                    .Get<Dictionary<string, string>>()
                                                ?? new Dictionary<string, string>();

    if (allowedClients.Values.All(k => k != apiKey))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        context.Response.Headers.WWWAuthenticate = "ApiKey";
        return;
    }

    await next(context);
});

// API Endpoints: Agents
RouteGroupBuilder agentsApi = app.MapGroup("/api/v1/agents");

agentsApi.MapPost("/", EnrollAgent);
agentsApi.MapGet("/", (IQueueService service) => Results.Ok(service.GetAgentsSummary()));
agentsApi.MapGet("/{agentId:guid}", (Guid agentId, IQueueService service) =>
    service.GetAgent(agentId) is { } agent ? Results.Ok(agent) : Results.NotFound());
agentsApi.MapDelete("/{agentId:guid}", (Guid agentId, IQueueService service) =>
    service.UnenrollAgent(agentId) ? Results.NoContent() : Results.NotFound());
agentsApi.MapPost("/{agentId:guid}/toggleStatus", (Guid agentId, IQueueService service) =>
    service.ToggleAgentStatus(agentId) switch
    {
        { } isActive => Results.Ok(isActive),
        _ => Results.NotFound()
    });

// API Endpoints: Turns
RouteGroupBuilder turnsApi = app.MapGroup("/api/v1/turns");

turnsApi.MapPost("/", async (string role, IQueueService service, IHubContext<TurnsHub> hub) =>
{
    await hub.Clients.All.SendAsync("turnCreated");
    return Results.Ok(service.CreateTurn(role));
});
turnsApi.MapGet("/", (IQueueService service, [FromQuery] string status = "Created") =>
!Enum.TryParse(status, true, out TurnStatus turnStatus)
    ? Results.BadRequest("Invalid status")
    : Results.Ok((object?) service.GetTurnsSummary(turnStatus)));
turnsApi.MapGet("/assign", (IQueueService service) => Results.Ok(service.GetAssignations()));
turnsApi.MapPost("/assign/{agentId:guid}", async (Guid agentId, IQueueService service, IHubContext<TurnsHub> hub) =>
{
    try
    {
        if (service.AssignTurn(agentId) is not { } assignation) return Results.NoContent();
        await hub.Clients.All.SendAsync("turnAssigned", assignation.Turn, assignation.Type, assignation.Station);
        return Results.Ok(assignation);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

app.Run();

return;

IResult EnrollAgent([FromBody] NewAgent newAgent, IQueueService service)
{
    try
    {
        Agent runner = service.EnrollAgent(newAgent.Role, newAgent.Station);
        return Results.Ok(runner);
    }
    catch (InvalidOperationException)
    {
        return Results.Conflict();
    }
}

record NewAgent(string Role, string Station);
