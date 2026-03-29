# Queuing System Backend

## Requirements

* I need to register runners, with their role and station
* I need to create turns
* I need to be able to get the current turn for a runner
* I need to assign the next available turn to a runner when they request it
* Runners can only have one turn at a time
* Runners can only have turns assigned to them if they are registered AND active
* Turns will queue up and be assigned to runners in the order they were created
* Runners can unregister themselves, which will make them unable to receive turns until they register again
* There needs to be an endpoint for listing all available turns, which can get filtered by requested role
* There needs to be an endpoint for listing all registered runners, indicating whether they are active or not

## Endpoints

### Runners

#### `POST /api/v1/runners`

Registers a new runner in the system with status "Inactive" (`IsActive` set to `false`).

**Parameters:**
- `role` (string, required): The role assigned to the runner
- `station` (string, required): The station where the runner is located

**Response:** Returns the newly created runner object with an assigned ID

---

#### `GET /api/v1/runners`
Retrieves all registered runners in the system, organized by role.

**Parameters:** None

**Response:** Returns an object containing:
- `totalRunners` (integer): Total count of registered runners
- `runners` (object): Runners grouped by role, with active/inactive status for each

---

#### `DELETE /api/v1/runners/{runnerId}`
Unregisters a runner from the system, preventing them from receiving new turns.

If a turn is currently assigned to the runner, mark it as "Completed".

**Parameters:**

- `runnerId` (string, required): The ID of the runner to unregister

**Response:** Confirmation of successful unregistration

---

#### `POST /api/v1/runners/{runnerId}/toggleStatus`
Toggles the active/inactive status of a registered runner.

If a turn is currently assigned to the runner, mark it as "Completed".

**Parameters:**

- `runnerId` (string, required): The ID of the runner whose status to toggle

**Response:** Returns the updated runner with the new status

### Turn

#### `POST /api/v1/turns`
Creates a new turn and adds it to the queue for assignment.

**Parameters:**
- `role` (string, required): The role required for this turn

**Response:** Returns the newly created turn object with initial status "Created"

---

#### `GET /api/v1/turns`

Retrieves all the turns in the system, grouping by the role.

**Parameters:**

- `status` (string, required): Filter turns by status, being "Created" the default filter

**Response:** Returns an object containing:
- `totalTurns` (integer): Total count of available turns
- `turnsByRole` (object): Turn counts grouped by requested role

---

#### `POST /api/v1/turns/assign/{runnerId}`
Assigns the next available turn in the queue for a specified role to a runner at a station.

**Parameters:**

- `runnerId` (string, required): The ID of the runner to receive the turn

**Response:** Returns the assigned turn object with updated status
