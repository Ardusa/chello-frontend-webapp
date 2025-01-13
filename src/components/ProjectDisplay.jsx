import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectDetails } from "../api"; // Assuming you have an API function to fetch project details

const ProjectDisplay = ({ onLogout }) => {
  const { project_id } = useParams(); // Access project_id from URL
  const [project, setProject] = useState(null); // Store project data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store error message
  const navigate = useNavigate(); // To navigate programmatically

  // Fetch project details when component mounts or project_id changes
  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectDetails(project_id); // Call your API to fetch project data
        if (data) {
          setProject(data); // Set the project data
        } else {
          setError("Project not found.");
        }
      } catch (error) {
        setError("Error fetching project details.");
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [project_id]); // Re-fetch if project_id changes

  // Handle back button
  const handleBack = () => {
    navigate("/dashboard"); // Navigate back to the dashboard or a previous page
  };

  // Render the project details or loading/error states
  return (
    <div>
      <button onClick={handleBack}>Back to Dashboard</button>
      {loading ? (
        <p>Loading project details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        project && (
          <div>
            <h2>{project.project_name}</h2>
            <p>{project.description}</p>
            <p>Start Date: {project.start_date}</p>
            <p>End Date: {project.end_date}</p>
            {/* Render additional project details here */}
          </div>
        )
      )}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default ProjectDisplay;
