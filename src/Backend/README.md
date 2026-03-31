# Queuing System Backend

The Queuing System Backend is a service designed to manage the flow of turns and agents in a structured environment. It
handles agent enrollment, status management, and turn assignment based on roles and stations.

## How to Run

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd QueuingSystem/src/Backend
   ```

2. **Configure Secrets**:
   The API uses an API Key middleware for authentication. You need to configure the allowed clients and their keys using
   `dotnet user-secrets`:
   ```bash
   dotnet user-secrets set "ApiKey:AllowedClients:ClientName" "your-secret-api-key"
   ```
   Replace `ClientName` with a name for your client and `your-secret-api-key` with a secure key. The application expects
   the `X-API-KEY` header to match one of these values.

3. **Run the application**:
   ```bash
   dotnet run
   ```
   The API will be available at the configured URLs (`http://localhost:5277`, check `Properties/launchSettings.json`).

4. **OpenAPI Documentation**:
   When running in development mode, you can access the OpenAPI specification at `/openapi/v1.json`.

## Endpoints

All endpoints require the `X-API-KEY` header for authentication.

### Agents

#### `POST /api/v1/agents`

Enrolls a new agent in the system with status "Inactive" (`IsActive` set to `false`).

**Body:**

- `role` (string, required): The role assigned to the agent
- `station` (string, required): The station where the agent is located

**Response:** Returns the newly enrolled agent object with an assigned ID

---

#### `GET /api/v1/agents`

Retrieves all enrolled agents in the system, organized by role.

**Parameters:** None

**Response:** Returns an object containing:

- `totalAgents` (integer): Total count of enrolled agents
- `agentsByRole` (array): List of agent groups, each containing a `role` and its list of `agents`

---

#### `GET /api/v1/agents/{agentId}`

Retrieves a specific agent by ID.

**Parameters:**

- `agentId` (guid, required): The ID of the agent

**Response:** The agent object or 404 if not found.

---

#### `DELETE /api/v1/agents/{agentId}`

Unenrolls an agent from the system, preventing them from receiving new turns.

If a turn is currently assigned to the agent, it is marked as "Completed".

**Parameters:**

- `agentId` (guid, required): The ID of the agent to unenroll

**Response:** 204 No Content on success or 404 if not found.

---

#### `POST /api/v1/agents/{agentId}/toggleStatus`

Toggles the active/inactive status of an enrolled agent.

If an agent is toggled from active to inactive and has an assigned turn, the turn is marked as "Completed".

**Parameters:**

- `agentId` (guid, required): The ID of the agent whose status to toggle

**Response:** Returns the new status (boolean)

---

### Turns

#### `POST /api/v1/turns`
Creates a new turn and adds it to the queue for assignment.

**Parameters:**

- `role` (query string, required): The role required for this turn

**Response:** Returns the newly created turn object with initial status "Created"

---

#### `GET /api/v1/turns`

Retrieves turns in the system, grouping by the role.

**Parameters:**

- `status` (query string, optional): Filter turns by status ("Created", "Assigned", "Completed"). Defaults to "Created".

**Response:** Returns an object containing:

- `totalTurns` (integer): Total count of turns matching the status
- `turnsByRole` (array): Turns grouped by requested role

---

#### `GET /api/v1/turns/assign`

Retrieves the most recent turn assignations, grouped by role (type).

**Parameters:** None

**Response:** Returns a list of assignation groups, showing the last 5 assignations per role.

---

#### `POST /api/v1/turns/assign/{agentId}`

Assigns the next available turn in the queue for the agent's role.

**Parameters:**

- `agentId` (guid, required): The ID of the agent to receive the turn

**Response:** Returns the assigned turn object or 204 if no turns are available for the agent's role.
