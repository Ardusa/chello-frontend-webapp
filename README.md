# Chello Frontend Webapp

Welcome to the **Chello Frontend**, the web-based interface for Chello—a task management and prioritization service designed to simplify workflows and improve productivity.

## Features

- **User Authentication**: Login and secure access with integration to the backend authentication system.
- **Manager-Account Relations**: Manage team structures with manager-account relationship capabilities.
- **Project Management**: Create, view, and modify projects seamlessly using backend API calls.
- **Task Interaction**: Assign tasks, update statuses, and handle dependencies via the intuitive interface.

## Technology Stack

- **Frontend Framework**: React with Vite for lightning-fast development and build performance.
- **State Management**: Built-in React hooks or additional libraries as needed.
- **Styling**: Modern, responsive UI design for an excellent user experience.
- **API Integration**: Interacts with the Chello backend to manage tasks, projects, and user relationships.

## Key Functionalities

### Login
- Authenticate users securely using the backend's `/login` API.
- Store tokens for session management.

### Manager-Account Relations
- Fetch and display accounts assigned to a manager.
- Visualize hierarchical relationships.

### Project Management
- Create new projects with ease.
- Edit project details and manage associated tasks.
- Retrieve projects from the backend using `/projects/get-projects`.

### Task Handling
- Display tasks within projects.
- Modify task dependencies and subtasks.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions, feedback, or feature requests, please use the repository’s issue tracker.

---

Happy coding with Chello!

