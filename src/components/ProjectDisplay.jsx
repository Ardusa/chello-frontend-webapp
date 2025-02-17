import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectDetails, createTask, updateTask, TaskCreate, fetchAccounts, getAccount, fetchTaskDetails, deleteTask, deleteProject } from "../services/api.js";
import { SimpleTreeView, TreeItem2 } from "@mui/x-tree-view";
import { CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SettingsIcon from '@mui/icons-material/Settings';
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
      icon: <AccountTreeIcon />,
      urlPath: `/projects/${project_id}/files`,
      name: "Task Explorer",
    },
    sprints: {
      element: <div />,
      icon: <RotateRightIcon />,
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
  const [project, setProject] = useState({});

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState(new TaskCreate({ project_id }));
  const [accounts, setAccounts] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [subtasksDict] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [editingTask, setEditingTask] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadProjectDetails();
      await fetchAccountDetails();
      setLoading(false);
    };

    loadData();
  }, [project_id, refresh]);

  const loadProjectDetails = async () => {
    try {
      const projectData = await fetchProjectDetails(project_id);
      setProject({ ...projectData });

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
      for (const [taskId, subTasks] of Object.entries(tasks)) {
        const task = await fetchTaskDetails(taskId);
        if (!task) {
          throw new Error("Failed to fetch task details for task:", taskId);
        }

        const findParentAndAssign = (task, dict) => {
          if (task.parent_task_id === null) {
            dict[task.id] = {};
            return true;
          }

          for (const [parentId, subtasks] of Object.entries(dict)) {
            // if the parentId is the parent of the task or the subtasks has the task already, assign it
            if (parentId === task.parent_task_id || subtasks[task.id]) {
              dict[parentId][task.id] = {};
              return true;
            }

            // if the subtasks is empty, skip to the next set of keys and values
            if (Object.keys(subtasks).length === 0) {
              continue;
            }

            if (findParentAndAssign(task, subtasks)) {
              return true;
            } else {
              continue;
            }
          }

          return false;
        };

        setTaskDetails((prev) => ({ ...prev, [taskId]: task }));

        if (!findParentAndAssign(task, subtasksDict)) {
          throw new Error("Failed finding parent and assigning task for ", task);
        }

        if (subTasks) {
          await fetchTaskDetailsRecursively(subTasks);
        }
      }
    } catch (error) {
      console.error("Error fetching task details recursively:", error);
    }
  };

  const handleOpenDialog = (parent_id = null) => {
    setNewTask((prev) => ({ ...prev, parent_task_id: parent_id }));
    setEditingTask(false);
    setOpen(true);
  };

  const handleOpenEditDialog = (taskId) => {
    setNewTask((prev) => ({ ...prev, ...taskDetails[taskId] }));
    setEditingTask(true);
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    setOpen(false);
    setNewTask(new TaskCreate({ project_id }));
    // setRefresh(!refresh);
  };

  const handleCreateTask = async () => {
    try {
      setRefresh(!refresh);
      await createTask(newTask);
      handleCloseDialog();
      setRefresh(!refresh);
    }
    catch (error) {
      console.error("Error creating task:", error);
      setError("Error creating task.");
    }
  }

  const handleEditTask = async () => {
    try {
      await updateTask(newTask);
      handleCloseDialog();
      setRefresh(!refresh);
    }
    catch (error) {
      console.error("Error editing task:", error);
      setError("Error editing task.");
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task.");
    }
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

  const renderTree = (nodeId, dict) => {
    const node = taskDetails[nodeId];
    if (!node) return null;

    const assignedAccount = accounts.find(emp => emp.id === node.assigned_to) || { name: "Unassigned" };
    const formattedDate = new Date(node.task_created).toLocaleDateString();

    return (
      <TreeItem2 key={node.id} itemId={node.id} label={
        <div className="task-node">
          <span className="task-name">{node.name}</span>
          <span className="task-description">{node.description}</span>
          {node.company_id &&
            <span>{assignedAccount.name}</span>
          }
          <span>{formattedDate}</span>
          <div>
            <div className="task-actions">
              <Button className="settings-button" onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(node.id); }} startIcon={<SettingsIcon />}>
                Edit
              </Button>
              <Button className="add-button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(node.id); }}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteTask(node.id); }}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
        </div>
      }
        sx={{
          '& .MuiTreeItem-content:hover, & .MuiTreeItem-content:active': {
            backgroundColor: node.is_finished ? 'lightgreen' : (node.task_start ? 'red' : 'lightyellow'),
          },
        }}
      >
        {dict[node.id] &&
          Object.keys(dict[node.id]).map((subtaskId) => renderTree(subtaskId, dict[node.id]))}
      </TreeItem2>
    );
  };

  if (loading) {
    return <div className="centered-container">
      <CircularProgress />
    </div>;
  }

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
          {Object.keys(project.tasks).map((subtaskId) => renderTree(subtaskId, project.tasks))}
          <div className="project-btn-container">
            <Button className="add-button" onClick={() => handleOpenDialog(null)} startIcon={<FontAwesomeIcon icon={faPlus} />} >Add Root Task</Button>
            <Button className="delete-button" onClick={() => handleDeleteProject(project_id)} startIcon={<FontAwesomeIcon icon={faTrash} />}>
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
            {editingTask ? (
              <Button onClick={handleEditTask} color="primary">Edit Task</Button>
            ) : (
              <Button onClick={handleCreateTask} color="primary">Create Task</Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export { ProjectTaskTree };