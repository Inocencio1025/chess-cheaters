FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY server.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "server.dll"]