import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectDetails, createTask, TaskCreate, fetchAccounts, getAccount, fetchTaskDetails, deleteTask, deleteProject } from "../services/api.js";
import { SimpleTreeView, TreeItem2 } from "@mui/x-tree-view";
import { CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import FolderIcon from '@mui/icons-material/Folder';
import "../css/project-display.css";
import Sidebar from "./Sidebar";

const ProjectDashboard = () => {
  const { project_id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshProjectData = async () => {
    await fetchProjectDetails(project_id).catch((e) => {
      console.error(e);
      if (e.status === 401) {
        console.log("Session expired. Redirecting to login page.");
        navigate("/login");
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshProjectData();
  }, [project_id]);

  let elements = {
    files: {
      element: <ProjectTaskTree />,
      icon: <FolderIcon />,
      urlPath: `/projects/${project_id}/files`,
      name: "Project Explorer",
    },
    sprints: {
      element: <div />,
      icon: <FolderIcon />,
      urlPath: `/projects/${project_id}/sprints`,
      name: "Sprints",
    }
  };

  return <Sidebar elements={elements} backLink="/dashboard/projects" loadingElement={loading} />;
};

export default ProjectDashboard;

const ProjectTaskTree = () => {
  const { project_id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    id: "",
    description: "",
    name: "",
    subtasks: {},
  });

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState(new TaskCreate({ project_id }));
  const [accounts, setAccounts] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [subtasksDict, setSubtasksDict] = useState({});

  useEffect(() => {
    loadProjectDetails();
    fetchAccountDetails();
  }, [project_id]);

  const loadProjectDetails = async () => {
    try {
      const projectData = await fetchProjectDetails(project_id);
      setProject({
        id: projectData.project.id,
        name: projectData.project.name,
        description: projectData.project.description,
        subtasks: projectData.tasks,
      });

      await fetchTaskDetailsRecursively(projectData.tasks);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Error fetching project details.");
    }
  };

  const fetchAccountDetails = async () => {
    try {
      const accounts = await fetchAccounts();
      setAccounts(accounts);

      const currentUser = await getAccount();
      setAccounts((prev) => [{ id: currentUser.id, name: currentUser.name }, ...prev]);
      setNewTask((prev) => ({ ...prev, assigned_to: currentUser.id }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Error fetching accounts.");
    }
  };

  const fetchTaskDetailsRecursively = async (tasks) => {
    try {
      const fetchTaskDetailsRecursivelyHelper = async (tasks) => {
        for (const [taskId, task_id_or_dict] of Object.entries(tasks)) {
          const task = await fetchTaskDetails(taskId);
          setTaskDetails((prev) => ({ ...prev, [taskId]: task }));
          if (task.parent_task_id) {
            const appendTaskToSubtasksDict = (dict, parentId, task) => {
              if (!dict[parentId]) {
                dict[parentId] = {};
              }
              dict[parentId][task.id] = task;
            };

            appendTaskToSubtasksDict(subtasksDict, task.parent_task_id, task);
          } else {
            if (!subtasksDict[taskId]) {
              setSubtasksDict((prev) => ({ ...prev, [taskId]: {} }));
            }
          }

          await fetchTaskDetailsRecursivelyHelper(task_id_or_dict);
        }
      };

      await fetchTaskDetailsRecursivelyHelper(tasks);
    } catch (error) {
      console.error("Error fetching task details recursively:", error);
    }
  };

  const handleOpenDialog = (parent_id = null) => {
    setNewTask((prev) => ({ ...prev, parent_task_id: parent_id }));
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    setOpen(false);
    setNewTask(new TaskCreate({ project_id }));
    await loadProjectDetails();
    await fetchAccountDetails();
    await fetchAccountDetails();
  };

  const handleCreateTask = async () => {
    try {
      await createTask(newTask);
      await handleCloseDialog();
    }
    catch (error) {
      console.error("Error creating task:", error);
      setError("Error creating task.");
    }
  }

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    await loadProjectDetails();
    await fetchAccountDetails();
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    navigate("/dashboard/projects");
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Render the tree structure
  const renderTree = (nodeId) => {
    const node = taskDetails[nodeId];
    if (!node) return null;

    const assignedAccount = accounts.find(emp => emp.id === node.assigned_to);

    return (
      <TreeItem2 key={node.id} itemId={node.id} label={
        <div className="task-node">
          <span className="task-name">{node.name}</span>
          <span>{assignedAccount ? assignedAccount.name : "Unassigned"}</span>
          <div>
            <div className="task-actions">
              <Button className="add-button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(node.id); }}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteTask(node.id); }}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
        </div>
      }>
        {subtasksDict[node.id] && Object.keys(subtasksDict[node.id]).map(subtaskId => {
          return renderTree(subtaskId);
        })}
      </TreeItem2>
    );
  };

  if (error) {
    return (
      <div className="centered-container">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="project-file-container">
      <div className="centered-container">
        <div className="project-header-container">
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>

        <SimpleTreeView
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 1,
            '& .MuiTreeItem-root': {
              padding: '10px 0',
              fontSize: '1.2rem',
              justifyContent: 'space-between',
              width: '100%',
            },
          }}

        >
          {Object.keys(project.subtasks).map((subtaskId) => renderTree(subtaskId))}
          <div className="project-btn-container">
                <Button className="add-button" onClick={() => handleOpenDialog(null)} startIcon={ <FontAwesomeIcon icon={faPlus} /> } >Add Root Task</Button>
            <Button className="delete-button" onClick={() => handleDeleteProject(project_id)} startIcon={ <FontAwesomeIcon icon={faTrash} /> }>
              Delete Project</Button>
          </div>
        </SimpleTreeView>

        <Dialog
          open={open}
          onClose={handleCloseDialog}
          sx={{
            '& .MuiDialog-paper': {
              width: '80%',
              maxWidth: 600,
              borderRadius: 2,
              boxShadow: 3,
            },
          }}
        >
          <DialogTitle>{newTask.parent_task_id ? "Add Subtask" : "Add Root Task"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Task Name"
              name="name"
              margin="dense"
              type="text"
              fullWidth
              value={newTask.name}
              onChange={handleTaskChange}
              autoFocus
              required
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="dense"
              value={newTask.description}
              onChange={handleTaskChange}
              required
            />
            <TextField
              label="Assigned To"
              name="assigned_to"
              fullWidth
              margin="dense"
              select
              value={newTask.assigned_to}
              onChange={handleTaskChange}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCreateTask} color="primary">Create Task</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export { ProjectTaskTree };