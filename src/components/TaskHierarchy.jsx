import React, { useEffect, useState } from "react";

const TaskHierarchy = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/projects/${projectId}/tasks`)
            .then(response => response.json())
            .then(data => setTasks(data.tasks))
            .catch(error => console.error("Error fetching tasks:", error));
    }, [projectId]);

    const renderTasks = (taskList) => {
        return (
            <ul>
                {taskList.map(task => (
                    <li key={task.task_id}>
                        {task.task_id} - {task.description}
                        {task.subtasks && task.subtasks.length > 0 && renderTasks(task.subtasks)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <h2>Task Hierarchy for Project {projectId}</h2>
            {tasks.length > 0 ? renderTasks(tasks) : <p>No tasks found.</p>}
        </div>
    );
};

export default TaskHierarchy;