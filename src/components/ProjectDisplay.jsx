import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectDetails, createTask, TaskCreate, fetchEmployees, getEmployee, fetchTaskDetails, deleteTask } from "../services/api.js";
import { SimpleTreeView, TreeItem2 } from "@mui/x-tree-view";
import { CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import FolderIcon from '@mui/icons-material/Folder';
import "../css/project-display.css";
import Sidebar from "./Sidebar";

const ProjectDashboard = () => {
  const { project_id } = useParams();
  const navigate = useNavigate();

  const refreshProjectData = () => {
    fetchProjectDetails(project_id).catch((e) => {
      console.error(e);
      if (e.status === 401) {
        console.log("Session expired. Redirecting to login page.");
        navigate("/login");
      }
    });
  };

  let funcs = [
    refreshProjectData,
  ];

  let elements = {
    files: {
      element: <ProjectTaskTree />,
      icon: <FolderIcon />,
      urlPath: `/projects/${project_id}/files`,
      name: "Project Explorer",
    },
  };

  return <Sidebar elements={elements} backLink="/dashboard/projects" useEffectFuncs={funcs} />;
};

export default ProjectDashboard;

const ProjectTaskTree = () => {
  const { project_id } = useParams();
  const [project, setProject] = useState({
    id: "",
    description: "",
    name: "",
    subtasks: {},
  });

  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState(null);
  const [newTask, setNewTask] = useState(new TaskCreate({ project_id }));
  const [employees, setEmployees] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [subtasksDict, setSubtasksDict] = useState({});

  useEffect(() => {
    loadProjectDetails();
    fetchEmployeeDetails();
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

      const { taskDetails, subtasksDict } = await fetchTaskDetailsRecursively(projectData.tasks);
      setTaskDetails(taskDetails);
      setSubtasksDict(subtasksDict);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Error fetching project details.");
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const employees = await fetchEmployees();
      setEmployees(employees);

      const currentUser = await getEmployee();
      setEmployees((prev) => [{ id: currentUser.id, name: currentUser.name }, ...prev]);
      setNewTask((prev) => ({ ...prev, assigned_to: currentUser.id }));
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Error fetching employees.");
    }
  };

  const fetchTaskDetailsRecursively = async (tasks) => {
    try {
      const fetchTaskDetailsRecursivelyHelper = async (tasks) => {
        for (const [taskId, task_id_or_dict] of Object.entries(tasks)) {
          const task = await fetchTaskDetails(taskId);
          taskDetails[taskId] = task;
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
              subtasksDict[taskId] = {};
            }
          }

          await fetchTaskDetailsRecursivelyHelper(task_id_or_dict);
        }
      };

      await fetchTaskDetailsRecursivelyHelper(tasks);
    } catch (error) {
      console.error("Error fetching task details recursively:", error);
    }

    return { taskDetails, subtasksDict };
  };

  const handleOpenDialog = (parent_id = null) => {
    setParentTaskId(parent_id);
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    setOpen(false);
    setNewTask(new TaskCreate({ project_id }));
    await loadProjectDetails();
    await fetchEmployeeDetails();
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
    await fetchEmployeeDetails();
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

    const assignedEmployee = employees.find(emp => emp.id === node.assigned_to);

    return (
      <TreeItem2 key={node.id} itemId={node.id} label={
        <div className="task-node">
          <span style={{ paddingLeft: "20px" }}>{node.name}</span>
          <span>{assignedEmployee ? assignedEmployee.name : "Unassigned"}</span>
          <div>
            <Button className="add-button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(node.id); }}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteTask(node.id); }}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
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
            width: '80%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 1,
            '& .MuiTreeItem-root': {
              padding: '10px 0',
              fontSize: '1.2rem',
              justifyContent: 'space-between',
            },
          }}

        >
          {Object.keys(project.subtasks).map((subtaskId) => renderTree(subtaskId))}
          <Button className="add-button" style={{ margin: '10px' }} onClick={() => handleOpenDialog(null)} sx={{ marginLeft: 2 }}>+ Add Root Task</Button>
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
          <DialogTitle>{parentTaskId ? "Add Subtask" : "Add Root Task"}</DialogTitle>
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
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
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