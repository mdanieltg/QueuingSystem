using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using QueuingSystem.Backend.DataTransferObjects;
using QueuingSystem.Backend.Models;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    string[] origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
    CorsPolicyBuilder policyBuilder = new CorsPolicyBuilder(origins)
        .AllowAnyMethod()
        .AllowAnyHeader();

    options.AddDefaultPolicy(!builder.Environment.IsDevelopment()
        ? policyBuilder.Build()
        : policyBuilder.AllowAnyOrigin().Build());
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

HashSet<Turn> turns = [];
HashSet<Runner> runners = [];
List<TurnAssignation> assignations = [];

// API Endpoints: Runners
app.MapPost("/api/v1/runners", EnrollRunner);
app.MapGet("/api/v1/runners", GetRunners);
app.MapGet("/api/v1/runners/{runnerId:guid}", GetRunner);
app.MapDelete("/api/v1/runners/{runnerId:guid}", UnenrollRunner);
app.MapPost("/api/v1/runners/{runnerId:guid}/toggleStatus", ToggleRunnerStatus);

// API Endpoints: Turns
app.MapPost("/api/v1/turns", CreateTurn);
app.MapGet("/api/v1/turns", GetTurns);
app.MapGet("/api/v1/turns/assign", GetAssignations);
app.MapPost("/api/v1/turns/assign/{runnerId:guid}", AssignTurn);

app.Run();

return;

IResult EnrollRunner([FromBody] NewRunner newRunner)
{
    Runner? existingRunner = runners.FirstOrDefault(r => r.Station == newRunner.Station && r.Role == newRunner.Role);
    if (existingRunner is not null) return Results.Conflict();

    Runner runner = new()
    {
        Id = Guid.NewGuid(),
        Role = newRunner.Role,
        Station = newRunner.Station,
        IsActive = false
    };
    runners.Add(runner);

    return Results.Ok(runner);
}

IResult GetRunners()
{
    return Results.Ok(new RunnersSummary
    {
        TotalRunners = runners.Count,
        RunnersByRole = runners
            .OrderBy(r => r.Station)
            .GroupBy(r => r.Role, (role, runnerCollection) => new RunnerGroup
            {
                Role = role,
                Runners = runnerCollection
            })
    });
}

IResult GetRunner(Guid runnerId)
{
    Runner? runner = runners.FirstOrDefault(r => r.Id == runnerId);
    return runner is not null ? Results.Ok(runner) : Results.NotFound();
}

IResult UnenrollRunner([FromRoute] Guid runnerId)
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
    return Results.Ok(runner.IsActive);
}

IResult CreateTurn([FromQuery] string role)
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
}


IResult GetTurns([FromQuery] string status = "Created")
{
    bool parsed = Enum.TryParse(status, ignoreCase: true, out TurnStatus turnStatus);
    if (!parsed) return Results.BadRequest("Invalid status");

    List<Turn> filteredTurns = turns.Where(t => t.Status == turnStatus)
        .OrderBy(t => t.CreatedAt)
        .ToList();

    return Results.Ok(new TurnsSummary
    {
        TotalTurns = filteredTurns.Count,
        TurnsByRole = filteredTurns.GroupBy(t => t.Role, (role, turnCollection) => new TurnGroup
        {
            Role = role,
            Turns = turnCollection
        })
    });
}

IResult GetAssignations()
{
    return Results.Ok(
        assignations
            .GroupBy(a => a.Type, (type, enumerable) => new
            {
                type,
                Assignations = enumerable.TakeLast(5).Reverse()
            })
    );
}

IResult AssignTurn([FromRoute] Guid runnerId)
{
    Runner? runner = runners.FirstOrDefault(r => r.Id == runnerId);
    if (runner is null) return Results.NotFound();
    if (!runner.IsActive) return Results.BadRequest();

    Turn? turn = turns.Where(t => t.Role == runner.Role && t.Status == TurnStatus.Created)
        .OrderBy(t => t.CreatedAt)
        .FirstOrDefault();
    if (turn is null) return Results.NoContent();

    // Complete ending turn
    runner.CurrentTurn?.Status = TurnStatus.Completed;
    runner.CurrentTurn?.CompletedAt = DateTime.UtcNow;

    // Assign new turn
    turn.Status = TurnStatus.Assigned;
    runner.CurrentTurn = turn;

    // Store assignation 
    var assignation = new TurnAssignation
    {
        Turn = turn.Code,
        Type = runner.Role,
        Station = runner.Station
    };
    assignations.Add(assignation);

    return Results.Ok(assignation);
}

record NewRunner(string Role, string Station);
