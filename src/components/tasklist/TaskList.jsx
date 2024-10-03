import React, { useState, useEffect } from 'react';
import { getTasks, getProjects, deleteTask, getUsers } from '../../services/api';
import FilterSort from '../filtersort/FilterSort';
import { filterTasks, sortTasks } from '../../services/filter';
import CreateTask from '../createtask/CreateTask';
import { Toast, Dropdown } from 'react-bootstrap';
import './tasklist.css'

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('title');
  const [selectedProject, setSelectedProject] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    if (userRole === 'manager') {
      fetchUsers();
    }
  }, [userRole]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user ? user.user.role : null);
  }, []);

  useEffect(() => {
    let result = tasks;
    if (selectedProject) {
      result = result.filter(task => task.project === selectedProject);
    }
    result = filterTasks(result, filter);
    result = sortTasks(result, sort);
    setFilteredTasks(result);
  }, [tasks, filter, sort, selectedProject]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification('Error fetching tasks');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showNotification('Error fetching projects');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
      showNotification('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Error deleting task');
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowCreateTask(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prevTasks => prevTasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    setTaskToEdit(null);
    setShowCreateTask(false);
    showNotification('Task updated successfully');
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleCancel = () => {
    setTaskToEdit(null);
    setShowCreateTask(false);
  };

  const handleTaskCreated = () => {
    fetchTasks();
    setShowCreateTask(false);
    showNotification('Task created successfully');
  };

  const filters = ['High', 'Medium', 'Low'];
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' }
  ];

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="task-list-container">
      <h1 className="task-list-header">Tasks</h1>
      <div className="filter-sort-container">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-filter">
            Filter: {filter || 'All'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setFilter('')}>All</Dropdown.Item>
            {filters.map((f) => (
              <Dropdown.Item key={f} onClick={() => setFilter(f)}>{f}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-sort">
            Sort by: {sortOptions.find(option => option.value === sort).label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {sortOptions.map((option) => (
              <Dropdown.Item key={option.value} onClick={() => setSort(option.value)}>{option.label}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-project">
            Project: {selectedProject ? projects.find(p => p._id === selectedProject)?.name : 'All'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedProject('')}>All Project's Tasks</Dropdown.Item>
            {projects.map((project) => (
              <Dropdown.Item key={project._id} onClick={() => setSelectedProject(project._id)}>{project.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="create-task-container">
        {userRole === 'manager' && !taskToEdit && (
          <button className="create-task-button" onClick={() => setShowCreateTask(true)}>Create New Task</button>
        )}
        {showCreateTask && (
          <CreateTask 
            onTaskCreated={handleTaskCreated}
            taskToEdit={taskToEdit}
            onTaskUpdated={handleTaskUpdated}
            onCancel={handleCancel}
          />
        )}
      </div>
      <div className="tasks-container">
        {filteredTasks.length > 0 ? (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task._id} className="task-item">
                <span className="task-title">{task.title}</span>
                <span className="task-priority">{task.priority}</span>
                <span className="task-status">{task.status}</span>
                <span className="task-due-date">{new Date(task.dueDate).toLocaleDateString()}</span>
                <span className="task-assigned-to">{userRole === 'manager' ? getUserName(task.assignedTo) : 'Assigned'}</span>
                {userRole === 'manager' && (
                  <div className="task-actions">
                    <button className="edit-button" onClick={() => handleEditTask(task)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tasks-message">
            {selectedProject && tasks.some(task => task.project === selectedProject) 
              ? "No tasks match the current filters" 
              : "No tasks available"}
          </p>
        )}
      </div>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default TaskList;