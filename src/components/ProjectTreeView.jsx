import React, { useState } from "react";
import "../css/styles.css"; // Ensure this path is correct

const ProjectTreeView = ({ projectName }) => {
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Track whether we are editing a task
    const [currentTask, setCurrentTask] = useState(null); // Track the task being edited or created

    const handleCreateTask = () => {
        setIsEditing(false);
        setCurrentTask({
            task_id: "",
            task_name: "",
            description: "",
            estimated_hours: "",
            assigned_employee_id: "",
        });
        setShowPopup(true);
    };

    const handleEditTask = (task) => {
        setIsEditing(true);
        setCurrentTask(task);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setCurrentTask(null);
    };

    const handleTaskSubmit = () => {
        if (!currentTask.task_id.trim() || !currentTask.task_name.trim()) {
            alert("Task ID and Task Name are required.");
            return;
        }

        if (isEditing) {
            // Update existing task
            setTasks(tasks.map((task) =>
                task.task_id === currentTask.task_id ? currentTask : task
            ));
        } else {
            // Add new task
            setTasks([...tasks, currentTask]);
        }
        handleClosePopup();
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.task_id !== taskId));
    };

    return (
        <div className="project-tree">
            <div className="tree-node">
                <strong>{projectName || "New Project"}</strong>
                <ul className="project-list">
                    {tasks.map((task) => (
                        <li key={task.task_id} className="task-item" onClick={() => handleEditTask(task)}>
                            <span>{task.task_name}</span>
                            <span className="task-id">({task.task_id})</span>
                            <button className="delete-task-btn" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.task_id); }}>
                                🗑️
                            </button>
                        </li>
                    ))}
                    <li className="create-task-btn" onClick={handleCreateTask}>
                        + Create Task
                    </li>
                </ul>
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{isEditing ? "Edit Task" : "Create Task"}</h3>

                        <label>Task ID:</label>
                        <input
                            type="text"
                            name="task_id"
                            value={currentTask.task_id}
                            onChange={(e) => setCurrentTask({ ...currentTask, task_id: e.target.value })}
                        />

                        <label>Task Name:</label>
                        <input
                            type="text"
                            name="task_name"
                            value={currentTask.task_name}
                            onChange={(e) => setCurrentTask({ ...currentTask, task_name: e.target.value })}
                        />

                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={currentTask.description}
                            onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                        />

                        <label>Estimated Hours:</label>
                        <input
                            type="number"
                            name="estimated_hours"
                            value={currentTask.estimated_hours}
                            onChange={(e) => setCurrentTask({ ...currentTask, estimated_hours: e.target.value })}
                        />

                        <label>Assigned Employee ID:</label>
                        <input
                            type="text"
                            name="assigned_employee_id"
                            value={currentTask.assigned_employee_id}
                            onChange={(e) => setCurrentTask({ ...currentTask, assigned_employee_id: e.target.value })}
                        />

                        <div className="popup-actions">
                            <button onClick={handleTaskSubmit}>{isEditing ? "Update Task" : "Create Task"}</button>
                            <button onClick={handleClosePopup}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTreeView;
