import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectDetails, createTask, TaskCreate, fetchEmployees, getEmployee, fetchTaskDetails } from "../services/api.js";
import { SimpleTreeView } from "@mui/x-tree-view";
import { TreeItem } from "@mui/x-tree-view";
import { CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";

const ProjectTaskTree = () => {
  const { project_id } = useParams();
  const [project, setProject] = useState({
    id: "",
    name: "",
    subtasks: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState(null);
  const [newTask, setNewTask] = useState(new TaskCreate({ project_id }));
  const [employees, setEmployees] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [subtasksDict, setSubtasksDict] = useState({});

  // Function to handle creating a task
  const handleCreateTask = async () => {
    await createTask(newTask).then((createdTask) => {
      setProject((prev) => ({
        ...prev,
        subtasks: insertTask(prev.subtasks || [], createdTask),
      }));
      handleCloseDialog();
    }).catch((error) => {
      console.error("Error creating task:", error);
      setError("Error creating task.");
    });
  }

  // Function to insert the new task into the correct position
  const insertTask = (tasks, newTask) => {
    if (!newTask.parent_task_id) {
      return [...tasks, newTask];
    }

    return tasks.map((task) => {
      if (task.id === newTask.parent_task_id) {
        return { ...task, subtasks: [...(task.subtasks || []), newTask] };
      } else {
        return { ...task, subtasks: insertTask(task.subtasks || [], newTask) };
      }
    });
  };

  // Function to update the newTask object as the form changes
  const handleTaskChange = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Combined useEffect to fetch project details and employees when component mounts
  useEffect(() => {
    const loadProjectDetails = async () => {
      await fetchProjectDetails(project_id).then((project_Data) => {
        console.log("Project:", project_Data);
        setProject({
          id: project_Data.project.id,
          name: project_Data.project.name,
          subtasks: Object.keys(project_Data.tasks),
        });
      }).catch((error) => {
        setError("Error fetching project details.", error);
      }).finally(() => {
        console.log("Project Details: ", project);
      });
      for (const taskId of Object.keys(project.subtasks)) {
        await fetchTaskDetailsRecursively(taskId).then(({ taskDetails, subtasksDict }) => {
          setTaskDetails(taskDetails);
          setSubtasksDict(subtasksDict);
        }).catch((error) => {
          console.error("Error fetching task details:", error);
          setError("Error fetching task details.");
        }).finally(() => {
          setLoading(false);
        });
      }
    }

  const fetchEmployeeDetails = async () => {
    await fetchEmployees().then((employees) => {
      setEmployees(employees);
    }).catch((error) => {
      console.error("Error fetching employees:", error);
      setError("Error fetching employees.");
    });

    await getEmployee().then((currentUser) => {
      const employeeToId = [
        { name: currentUser.name, id: currentUser.id },
        ...employees.map(employee => ({
          name: employee.name,
          id: employee.id
        }))
      ]
      setEmployees(prev => [...prev, ...employeeToId]);
      console.log("Employee to ID:", employeeToId);
      setNewTask(prev => ({ ...prev, assigned_to: currentUser.id }));
    }).catch((error) => {
      console.error("Error fetching employees:", error);
      setError("Error fetching employees.");
    });
  };

  const fetchTaskDetailsRecursively = async (taskId, taskDetails = [], subtasksDict = {}) => {
    try {
      const task = await fetchTaskDetails(taskId);
      taskDetails.push(task);
  
      if (task.subtasks && Object.keys(task.subtasks).length > 0) {
        subtasksDict[taskId] = task.subtasks;
  
        for (const subtaskId of Object.keys(task.subtasks)) {
          await fetchTaskDetailsRecursively(subtaskId, taskDetails, subtasksDict);
        }
      }
    } catch (error) {
      console.error(`Error fetching details for task ${taskId}:`, error);
    }
  
    return { taskDetails, subtasksDict };
  };

  loadProjectDetails();
  fetchEmployeeDetails();
}, [project_id]);

// Open dialog to add a task, with optional parent task id
const handleOpenDialog = (parent_id = null) => {
  setParentTaskId(parent_id);
  setNewTask(new TaskCreate({ project_id, parent_task_id: parent_id }));
  setOpen(true);
};

const handleCloseDialog = () => {
  setOpen(false);
};

// Render the tree structure
const renderTree = (nodes) => (
  <TreeItem key={nodes.id} itemId={nodes.id} label={nodes.name}>
    {subtasksDict[nodes.id] && Object.keys(subtasksDict[nodes.id]).length > 0
      ? Object.keys(subtasksDict[nodes.id]).map((subtaskId) => {
          const subtask = taskDetails.find((task) => task.id === subtaskId);
          return subtask ? renderTree(subtask) : null;
        })
      : null}
    <Button onClick={() => handleOpenDialog(nodes.id)}>+ Add Task</Button>
  </TreeItem>
);

// Display loading, error, or the task tree
if (loading) {
  <div className="centered-container">
    return <CircularProgress />;
  </div>
}

if (error) {
  <div className="centered-container">
    return <Typography color="error">{error}</Typography>;
  </div>
}

return (
  <div className="centered-container">
    <SimpleTreeView
      sx={{
        width: '100%',
        maxWidth: 400,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      {Object.keys(project.subtasks).length > 0 ? renderTree(project) : <Typography>No project data available.</Typography>}
      <Button
        onClick={() => handleOpenDialog(null)}
        sx={{
          marginTop: 2,
          padding: '8px 16px',
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        + Add Root Task
      </Button>
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
      <DialogTitle>{parentTaskId ? "Add Subtask" : "Add Task"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Name"
          fullWidth
          margin="dense"
          value={newTask.name}
          onChange={(e) => handleTaskChange("name", e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={newTask.description}
          onChange={(e) => handleTaskChange("description", e.target.value)}
        />
        <TextField
          select
          label="Assigned To"
          fullWidth
          margin="dense"
          value={newTask.assigned_to}
          onChange={(e) => handleTaskChange("assigned_to", e.target.value)}
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
);
};

export default ProjectTaskTree;
