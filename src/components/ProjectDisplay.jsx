import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { fetchProjectDetails, ProjectResponse } from "../api"; // Assuming you have an API function to fetch project details
// import "../css/project-display.css";

const ProjectDisplay = ({ onLogout }) => {
  const { project_id } = useParams();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectDetails(project_id);
        if (data) {
          setProject(data);
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
  }, [project_id]);

  const handleBack = () => {
    navigate("/dashboard/projects");
  };

  return (
    <div className="centered-container">
      {loading ? (
        <p>Loading project details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        project && (
          <div>
            <h2>{project.description}</h2>
            <p>{project.description}</p>
            <p>Start Date: {project.start_date}</p>
            <p>End Date: {project.end_date}</p>
          </div>
        )
      )}
      <button className='arrow backward-btn' onClick={handleBack}></button>
      {/* <button onClick={onLogout}>Logout</button> */}
    </div>
  );
};

export default ProjectDisplay;
