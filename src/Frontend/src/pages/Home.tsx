import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enroll } from "../api/agentsApi.ts";
import { AgentRole } from "../models/AgentRole.ts";

export default function Home() {
  const [role, setRole] = useState<AgentRole | "">("");
  const [station, setStation] = useState("");
  const [roleError, setRoleError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleEnroll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate role and station
    if (!role) {
      setRoleError("Please select a role");
      return;
    }

    if (!station) {
      setRoleError("Please enter a valid station number");
      return;
    }

    try {
      // Call API to enroll role and station
      const agent = await enroll(role, station);

      // Save id, role, and station in local storage
      localStorage.setItem("id", agent.id);

      // Redirect to role agent
      navigate("/role");
    } catch (err) {
      console.error(err);
      setRoleError(err instanceof Error ? err.message : "Error when trying to enroll");
    }
  }

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      navigate("/role");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Queuing System</h1>
      <p>Choose the role for this station</p>
      <div className="row g-3">
        <div className="col">
          <h2>Turn Machine</h2>
          <button onClick={() => navigate("/turns")}
                  className="btn btn-primary">Go
          </button>
        </div>
        <div className="col">
          <h2>Turn Display</h2>
          <button onClick={() => navigate("/display")}
                  className={"btn btn-primary"}>Go
          </button>
        </div>
        <form onSubmit={handleEnroll} className={"col-12"}>
          <h2>Service Agent</h2>
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as AgentRole)}
                className={"form-select"} id="role">
                <option value="">Select a role</option>
                <option value={AgentRole.WINDOW}>Window</option>
                <option value={AgentRole.EXECUTIVE}>Executive</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="station" className="form-label">Station</label>
              <input value={station}
                     onChange={e => setStation(e.target.value)}
                     className="form-control" type="text" id="station" placeholder="Desk or Window #" />
            </div>
            <div className="col-12">
              <input type="submit" value="Enroll" className={"btn btn-primary mt-2"} />
            </div>
            {roleError && <div className="col-12 alert alert-danger">{roleError}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
