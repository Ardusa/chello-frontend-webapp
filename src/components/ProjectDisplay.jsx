import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectDetails, createTask, TaskCreate, fetchEmployees, getEmployee, fetchTaskDetails, fetchProjects, registerEmployee, createProject, ProjectCreate, EmployeeCreate, ProjectResponse } from "../services/api.js";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { CircularProgress, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Autocomplete } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InsightsIcon from '@mui/icons-material/Insights';
import BackIcon from '@mui/icons-material/ArrowBack';
import logo from "../assets/logo.png";
import "../css/project-display.css";
import Sidebar from "./Sidebar";

// const Dashboard = () => {
//   // const [project, setProject] = useState(new ProjectResponse());

//   // const refreshProjectData = () => {
//   //   fetchProjectDetails(project_id).then((e) => {
//   //     setProject(e.project);
//   //   }
//   //   ).catch((e) => {
//   //     console.error(e);
//   //     if (e.status === 401) {
//   //       console.log("Session expired. Redirecting to login page.");
//   //       navigate("/login");
//   //     }
//   //   });
//   // };

//   useEffect(() => {
//     refreshProjectData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleSettings = () => {
//     navigate("/settings");
//   }

//   const handleDashboard = () => {
//     navigate("/dashboard/projects");
//   }

//   return (
//     <div className="project-dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <img src={logo} alt="Chello Logo" className="logo-img" />
//         <h1 style={{ fontSize: "70px", color: "black", marginTop: "10px" }}>{project.name}</h1>
//         <nav className="nav">
//           {[
//             { id: "files", name: "Project Explorer", icon: <FolderIcon /> },
//             { id: "insights", name: "Insights", icon: <InsightsIcon /> },
//             { id: "employees", name: "Employees", icon: <AssignmentIndIcon /> },
//           ].map((section) => (
//             <Button
//               key={section.id}
//               className={`nav-item ${selectedSection === section.id ? "active" : ""}`}
//               onClick={() => {
//                 navigate(`/projects/${project_id}/${section.id}`);
//                 setSelectedSection(section.id);
//               }}
//               startIcon={section.icon}
//               disableRipple
//             >
//               {section.name}
//             </Button>
//           ))}
//         </nav>
//         <Button variant="contained" color="secondary" className="dashboard-btn" startIcon={<BackIcon />} onClick={() => handleDashboard()}>
//           Back To Dashboard
//         </Button>
//         <Button variant="contained" color="info" className="settings-btn" startIcon={<SettingsIcon />} onClick={() => handleSettings()}>
//           Settings
//         </Button>
//         <Button variant="outlined" color="error" className="logout-btn" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
//           Logout
//         </Button>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         {selectedSection === "files" && <ProjectTaskTree />}
//         {selectedSection === "insights" && <ProjectTaskTree />}
//         {selectedSection === "employees" && <ProjectTaskTree />}
//         {/* {selectedSection === "insights" && <InsightsCards />}
//               {selectedSection === "employees" && <EmployeeCards employees={employees} refreshEmployees={refreshEmployees} />} */}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

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

  const fetchTaskDetailsRecursively = async (tasks) => {
    try {
      const fetchTaskDetailsRecursivelyHelper = async (tasks) => {
        for (const [taskId, task_id_or_dict] of Object.entries(tasks)) {
          const task = await fetchTaskDetails(taskId);
          taskDetails[taskId] = task;
          if (task.parent_task_id) {
            const appendTaskToSubtasksDict = (dict, parentId, task) => {
              for (const key in dict) {
                if (key === parentId) {
                  dict[key][task.id] = task;
                  return true;
                }
                if (appendTaskToSubtasksDict(dict[key], parentId, task)) {
                  return true;
                }
              }
              return false;
            };

            if (!appendTaskToSubtasksDict(subtasksDict, task.parent_task_id, task)) {
              subtasksDict[task.parent_task_id] = { [task.id]: task };
            }
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
      <TreeItem key={node.id} itemId={node.id} label={
        <div className="task-node">
          <span>{node.name}</span>
          <div>
            <Button className="add-button" onClick={() => handleOpenDialog(node.id)}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button className="delete-button" onClick={() => handleDeleteTask(node.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </div>
      }>
        {subtasksDict[node.id] && Object.keys(subtasksDict[node.id]).map(subtaskId => {
          return renderTree(subtaskId);
        })}
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
    <div className="project-file-container">
      <div className="centered-container">
        <div className="project-header">
          <h1>{project.name}</h1>
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
          {/* <TreeItem key={project.id} itemId={project.id} label={project.name}> */}
          {Object.keys(project.subtasks).length > 0 ? (
            Object.keys(project.subtasks).map((subtaskId) => renderTree(subtaskId))
          ) : (
            <Typography>No project data available.</Typography>
          )}
          <Button className="add-button" style={{ marginBottom: '10px' }} onClick={() => handleOpenDialog(null)} sx={{ marginLeft: 2 }}>+ Add Root Task</Button>
          {/* </TreeItem> */}
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
    </div>
  );
};

export { ProjectTaskTree };