using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using TurnSystem.Backend.Models;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

List<Turn> turns = [];
List<Runner> runners = [];

// API Endpoints: Runners
app.MapPost("/api/v1/runners", CreateRunner);
app.MapGet("/api/v1/runners", GetRunners);
app.MapDelete("/api/v1/runners/{runnerId:guid}", DeleteRunner);
app.MapPost("/api/v1/runners/{runnerId:guid}/toggleStatus", ToggleRunnerStatus);

// API Endpoints: Turns
app.MapPost("/api/v1/turns", ([FromQuery] string role) =>
{
    var newGuid = Guid.NewGuid();
    Turn turn = new()
    {
        Id = newGuid,
        Code = newGuid.ToString("N")[28..],
        Role = role,
        Status = TurnStatus.Created,
        CreatedAt = DateTime.UtcNow
    };

    turns.Add(turn);
    return Results.Ok(turn);
});
app.MapGet("/api/v1/turns", ([FromQuery] string status = "Created") =>
{
    bool parsed = Enum.TryParse(status, ignoreCase: true, out TurnStatus turnStatus);
    if (!parsed) return Results.BadRequest("Invalid status");

    List<Turn> filteredTurns = turns
        .Where(t => t.Status == turnStatus)
        .OrderBy(t => t.CreatedAt)
        .ToList();
    int totalTurns = filteredTurns.Count;

    return Results.Ok(new
    {
        totalTurns,
        turns = filteredTurns.GroupBy(t => t.Role, (role, turns) => new
        {
            role,
            count = turns.Count(),
            items = turns
        })
    });
});
app.MapPost("/api/v1/turns/assign/{runnerId:guid}", ([FromRoute] Guid runnerId) =>
{
    Runner? runner = runners.FirstOrDefault(r => r.Id == runnerId);
    if (runner is null) return Results.NotFound();
    if (!runner.IsActive) return Results.BadRequest();

    Turn? turn = turns
        .Where(t => t.Role == runner.Role && t.Status == TurnStatus.Created)
        .OrderBy(t => t.CreatedAt)
        .FirstOrDefault();
    if (turn is null) return Results.NoContent();

    // Complete ending turn
    runner.CurrentTurn?.Status = TurnStatus.Completed;
    runner.CurrentTurn?.CompletedAt = DateTime.UtcNow;

    // Assign new turn
    turn.Status = TurnStatus.Assigned;
    runner.CurrentTurn = turn;
    return Results.Ok(new
    {
        Turn = turn.Code,
        StationType = runner.Role,
        runner.Station
    });
});

app.Run();

IResult CreateRunner([FromBody] RunnerForCreation runner)
{
    Runner? existingRunner = runners.FirstOrDefault(r => r.Station == runner.Station && r.Role == runner.Role);
    if (existingRunner is not null) return Results.Conflict();

    Runner newRunner = new()
    {
        Id = Guid.NewGuid(),
        Role = runner.Role,
        Station = runner.Station,
        IsActive = false
    };
    runners.Add(newRunner);

    return Results.Ok(newRunner);
}

IResult GetRunners()
{
    int totalRunners = runners.Count;
    return Results.Ok(new
    {
        totalRunners,
        runners = runners
        .OrderBy(r => r.Station)
        .GroupBy(r => r.Role, (role, runners) => new
        {
            role,
            count = runners.Count(),
            items = runners
        })
    });
}

IResult DeleteRunner([FromRoute] Guid runnerId)
{
    Runner? runner = runners.FirstOrDefault(r => r.Id == runnerId);
    if (runner is null) return Results.NotFound();

    // Complete ending turn
    runner.CurrentTurn?.Status = TurnStatus.Completed;
    runner.CurrentTurn?.CompletedAt = DateTime.UtcNow;
    runner.CurrentTurn = null;

    runners.Remove(runner);
    return Results.NoContent();
}

IResult ToggleRunnerStatus([FromRoute] Guid runnerId)
{
    Runner? runner = runners.FirstOrDefault(r => r.Id == runnerId);
    if (runner is null) return Results.NotFound();

    // Complete ending turn if going inactive
    if (runner.IsActive)
    {
        runner.CurrentTurn?.Status = TurnStatus.Completed;
        runner.CurrentTurn?.CompletedAt = DateTime.UtcNow;
        runner.CurrentTurn = null;
    }

    runner.IsActive = !runner.IsActive;
    return Results.NoContent();
}

record RunnerForCreation(string Role, string Station);
