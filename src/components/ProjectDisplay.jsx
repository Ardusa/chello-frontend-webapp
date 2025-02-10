import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjectDetails } from '../services/api.js';
import TaskTree from './TaskTree';

const ProjectDisplay = () => {
  const { project_id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectDetails(project_id);
        if (data) {
          setProject(data);
        } else {
          setError('Project not found.');
        }
      } catch (error) {
        setError('Error fetching project details.');
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [project_id]);

  if (loading) {
    return <p>Loading project details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="project-display">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <p>Start Date: {project.start_date}</p>
      <p>End Date: {project.end_date}</p>
      <TaskTree project={project} />
    </div>
  );
};

export default ProjectDisplay;