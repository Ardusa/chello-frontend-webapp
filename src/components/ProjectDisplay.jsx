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
  const [taskDetails, setTaskDetails] = useState({});
  const [subtasksDict, setSubtasksDict] = useState({});

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const projectData = await fetchProjectDetails(project_id);
        setProject({
          id: projectData.project.id,
          name: projectData.project.name,
          subtasks: projectData.tasks,
        });

        const { taskDetails, subtasksDict } = await fetchTaskDetailsRecursively(projectData.tasks);
        setTaskDetails(taskDetails);
        setSubtasksDict(subtasksDict);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Error fetching project details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployeeDetails = async () => {
      try {
        const employees = await fetchEmployees();
        setEmployees(employees);

        const currentUser = await getEmployee();
        setNewTask((prev) => ({ ...prev, assigned_to: currentUser.id }));
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching employees.");
      }
    };

    loadProjectDetails();
    fetchEmployeeDetails();
  }, [project_id]);

  const fetchTaskDetailsRecursively = async (tasks, taskDetails = {}, subtasksDict = {}) => {
    try {
      for (const taskId of Object.keys(tasks)) {
        const task = await fetchTaskDetails(taskId);
        taskDetails[taskId] = task;

        if (task.subtasks && Object.keys(task.subtasks).length > 0) {
          subtasksDict[taskId] = task.subtasks;
          await fetchTaskDetailsRecursively(task.subtasks, taskDetails, subtasksDict);
        }
      }
    } catch (error) {
      console.error(`Error fetching details for task ${taskId}:`, error);
    }

    return { taskDetails, subtasksDict };
  };

  // Open dialog to add a task, with optional parent task id
  const handleOpenDialog = (parent_id = null) => {
    setParentTaskId(parent_id);
    setNewTask(new TaskCreate({ project_id, parent_task_id: parent_id }));
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

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

  // Render the tree structure
  const renderTree = (nodeId) => {
    const node = taskDetails[nodeId];
    if (!node) return null;

    return (
      <TreeItem key={node.id} itemId={node.id} label={node.name}>
        {console.log("Node:", node)}
        {console.log("Task Details:", taskDetails)}

        {subtasksDict[node.id] && Object.keys(subtasksDict[node.id]).map(subtaskId => {
          return renderTree(subtaskId);
        })}

        <Button onClick={() => handleOpenDialog(node.id)}>+ Add Task</Button>
      </TreeItem>
    );
  };

  // Display loading, error, or the task tree
  if (loading) {
    return (
      <div className="centered-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered-container">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="centered-container">
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
        <TreeItem key={project.id} itemId={project.id} label={project.name}>
          {Object.keys(project.subtasks).length > 0 ? (
            Object.keys(project.subtasks).map((subtaskId) => renderTree(subtaskId))
          ) : (
            <Typography>No project data available.</Typography>
          )}
          <Button onClick={() => handleOpenDialog(null)} sx={{ marginLeft: 2 }}>+ Add Root Task</Button>
        </TreeItem>
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