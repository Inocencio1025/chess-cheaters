using server.Hubs;

var builder = WebApplication.CreateBuilder(args);

var clientUrl = "https://chess-cheaters-indol.vercel.app";

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Client", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                clientUrl
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("Client");

app.MapGet("/", () => "Chess Cheaters Server is running!");

app.MapHub<GameHub>("/game");

app.Run();