import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
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
  const [taskDetails] = useState({});
  const [subtasksDict] = useState({});
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState(false);
  const [openTaskRef, setOpenTaskRef] = useState(null);

  const [renderedTasks, setRenderedTasks] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAccountDetails();
      await loadProjectDetails();

      setExpandedItems(Object.keys(taskDetails));

      setLoading(false);
    };

    loadData();
  }, [project_id]);

  const loadProjectDetails = async () => {
    try {
      const projectData = await fetchProjectDetails(project_id);
      setProject({ ...projectData });

      await fetchTaskDetailsRecursively(projectData.tasks);


      const tasks = Object.keys(projectData.tasks).map((subtaskId) => {
        const tree = renderTree(subtaskId, projectData.tasks);
        // console.log("tree", tree);
        return tree;
      });

      setRenderedTasks(tasks);

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

        taskDetails[taskId] = task;

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

  const handleOpenDialog = (ref = null, parent_id) => {
    setNewTask((prev) => ({ ...prev, parent_task_id: parent_id }));
    setEditingTask(false);
    setOpen(true);
    setOpenTaskRef(ref);
  };

  const findTree = (nodeId) => {
    // given nodeId, find the tree element that is the node. this includes all the subtask elements
    // will be recursive

    console.log("renderedTasks", renderedTasks);

    for (const task of renderedTasks) {
      console.log("task", task);
    }

    const node = taskDetails[nodeId];
    if (!node) return null;

    const recursiveTreeSearch = (nodeId, dict, parentTree) => {
      console.log("nodeId", nodeId);
      console.log("dict", dict);
      console.log("parentTree", parentTree);

      if (nodeId === parentTree.key) {
        return parentTree;
      }

      for (const [subtaskId, subtasks] of Object.entries(dict)) {
        for (const child of parentTree.props.children) {
          if (child.key === subtaskId) {
            return child;
          }
          if (recursiveTreeSearch(nodeId, subtasks, child)) {
            return parentTree.children;
          }
        }
      }

      return null;
    };

    // return recursiveTreeSearch(nodeId, subtasksDict, renderedTasks);
    // for (const task of renderedTasks) {
    //   if (recursiveTreeSearch(nodeId, subtasksDict, task)) {
    //     return task;
    //   }
    // }

  };

  const handleOpenEditDialog = (ref, taskId) => {
    setNewTask((prev) => ({ ...prev, ...taskDetails[taskId] }));
    setEditingTask(true);
    setOpenTaskRef(ref);
    setOpen(true);
  };

  const handleCloseDialog = async () => {
    setOpen(false);
    setNewTask(new TaskCreate({ project_id, assigned_to: newTask.assigned_to }));
    setEditingTask(false);
    setOpenTaskRef(null);
  };

  const handleCreateTask = async () => {
    try {
      const task = await createTask(newTask);
      await loadProjectDetails();

      const findChildren = (nodeId, dict) => {
        if (dict[nodeId]) {
          return dict[nodeId];
        } else {
          for (const [parentId, subtasks] of Object.entries(dict)) {
            if (findChildren(nodeId, subtasks)) {
              return subtasks;
            }
          }
        }
      };

      if (openTaskRef && openTaskRef.current) {
        const root = createRoot(openTaskRef.current);
        const parentTree = findTree(newTask.parent_task_id);
        if (parentTree) {
          parentTree.props.children.push(renderTree(task.id, findChildren(task.id, subtasksDict)));
          root.render(parentTree);
        }
      }

      setExpandedItems((prev) => [...new Set([...prev, newTask.parent_task_id, task.id])]);

      handleCloseDialog();
    }
    catch (error) {
      console.error("Error creating task:", error);
      setError("Error creating task.");
    }
  }

  const handleEditTask = async () => {
    try {
      const task = await updateTask(newTask);
      console.log("task", task);

      taskDetails[task.id] = task;

      const findChildren = (nodeId, dict) => {
        if (dict[nodeId]) {
          return dict[nodeId];
        } else {
          for (const [parentId, subtasks] of Object.entries(dict)) {
            if (findChildren(nodeId, subtasks)) {
              return subtasks;
            }
          }
        }
      };
      
      const newTree = (
        <SimpleTreeView>
          {renderTree(task.id, findChildren(task.id, subtasksDict))}
        </SimpleTreeView>
      );

      if (openTaskRef && openTaskRef.current) {
        const root = createRoot(openTaskRef.current);
        root.render(newTree);
      }

      handleCloseDialog();
    }
    catch (error) {
      console.error("Error editing task:", error);
      setError("Error editing task.");
    }
  }

  const handleDeleteTask = async (ref, taskId) => {
    try {
      await deleteTask(taskId);
      if (ref && ref.current) {
        ref.current.remove();
      }
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

  const handleExpandedItemsChange = (event, itemIds) => {
    setExpandedItems(itemIds);
  };

  const renderTree = (nodeId, dict) => {
    const node = taskDetails[nodeId];
    if (!node) return null;

    const assignedAccount = accounts.find(emp => emp.id === node.assigned_to) || { name: "Unassigned" };
    const formattedDate = new Date(node.task_created).toLocaleDateString();

    const taskRef = React.createRef();
    return (
      <TreeItem2 key={node.id} itemId={node.id} ref={taskRef} label={
        <div className="task-node">
          <span className="task-name">{node.name}</span>
          <span className="task-description">{node.description}</span>
          {node.company_id &&
            <span>{assignedAccount.name}</span>
          }
          <span>{formattedDate}</span>
          <div>
            <div className="task-actions">
              <Button className="settings-button" onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(taskRef, node.id); }} startIcon={<SettingsIcon />}>
                Edit
              </Button>
              <Button className="add-button" onClick={(e) => { e.stopPropagation(); handleOpenDialog(taskRef, node.id); }}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteTask(taskRef, node.id); }}>
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
        {/* {console.log("taskRef", taskRef)} */}
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
          <h1>{project.project.name}</h1>
          <p>{project.project.description}</p>
        </div>

        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
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
          {/* {console.log("prev", Object.keys(project.tasks).map((subtaskId) => renderTree(subtaskId, project.tasks)))} */}
          {renderedTasks}
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