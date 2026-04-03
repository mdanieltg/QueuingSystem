# Build React app
FROM node:22 AS frontend
WORKDIR /frontend

COPY src/Frontend/package*.json ./
RUN npm clean-install

COPY src/Frontend/ ./
RUN npm run build

# Use Microsoft .NET 10 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["src/Backend/QueuingSystem.Backend.csproj", "src/Backend/"]
RUN dotnet restore "src/Backend/QueuingSystem.Backend.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/src/Backend"

# Build and publish the application
RUN dotnet build "QueuingSystem.Backend.csproj" -c Release -o /app/build
RUN dotnet publish "QueuingSystem.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Copy React build output into wwwroot
COPY --from=frontend /frontend/dist /app/publish/wwwroot

# Use the .NET 10 runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "QueuingSystem.Backend.dll"]
