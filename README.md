# Queuing Machine

This project demonstrates the operation of a queuing system for customer/user service. It consists of a .NET backend and a React frontend.

Use cases vary from Banks, Customer Service Centers, or government agencies.

Currently, the roles are fixed to bank branch service roles.

## Project Structure

- **src/Backend**: ASP.NET Core Web API managing turns, agents, and real-time notifications via SignalR.
- **src/Frontend**: React application (Vite, TypeScript) providing dashboards for agents, turn display, and turn generation.

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd src/Backend
   ```
2. Configure API Key secrets (required for authentication):
   ```bash
   dotnet user-secrets set "ApiKey:AllowedClients:Default" "your-secret-key"
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
   The backend will be available at `http://localhost:5277` (by default).

For more details, see [Backend README](src/Backend/README.md).

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd src/Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file or set environment variables to point to the backend:
   ```env
   VITE_API_BASE_URL=http://localhost:5277/api/v1
   VITE_API_KEY=your-secret-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Architecture

- **Backend**: Uses a Singleton service to manage the in-memory state of turns and agents. It uses SignalR to broadcast turn updates to all connected clients.
- **Frontend**: Built with React and Bootstrap. It uses Axios for REST API calls and `@microsoft/signalr` for real-time updates.
