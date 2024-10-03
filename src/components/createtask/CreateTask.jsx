import React, { useState, useEffect } from 'react';
import { createTask, getProjects, getUsers, updateTask } from '../../services/api';
import './createtask.css'

const CreateTask = ({ onTaskCreated, taskToEdit, onTaskUpdated, onCancel }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    project: '',
    assignedTo: '',
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (taskToEdit) {
      setTaskData(taskToEdit);
      setIsEditing(true);
    } else {
      resetTaskData();
      setIsEditing(false);
    }
  }, [taskToEdit]);

  const resetTaskData = () => {
    setTaskData({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
      project: '',
      assignedTo: '',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const teamMembers = response.data.filter(user => user.role === 'team_member');
      setUsers(teamMembers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dueDate') {
      setTaskData(prevData => ({
        ...prevData,
        [name]: new Date(value).toISOString()
      }));
    } else {
      setTaskData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let response;
      if (isEditing) {
        response = await updateTask(taskData._id, taskData);
        if (onTaskUpdated) onTaskUpdated(response.data);
      } else {
        response = await createTask(taskData);
        if (onTaskCreated) onTaskCreated(response.data);
      }
      setNotification(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
      resetTaskData();
      setIsEditing(false);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error creating/updating task:', error);
      setError('Failed to create/update task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-task-form">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <div className="error-message">{error}</div>}
      {notification && <div className="notification-message">{notification}</div>}
      <label htmlFor="title">Task Title</label>
      <input
        type="text"
        id="title"
        name="title"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Task Title"
        required
      />
      <label htmlFor="description">Task Description</label>
      <textarea
        id="description"
        name="description"
        value={taskData.description}
        onChange={handleChange}
        placeholder="Task Description"
      />
      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        value={taskData.status}
        onChange={handleChange}
        required
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <label htmlFor="priority">Priority</label>
      <select
        id="priority"
        name="priority"
        value={taskData.priority}
        onChange={handleChange}
        required
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <label htmlFor="dueDate">Due Date</label>
      <input
        type="date"
        id="dueDate"
        name="dueDate"
        value={formatDate(taskData.dueDate)}
        onChange={handleChange}
      />
      <label htmlFor="project">Project</label>
      <select
        id="project"
        name="project"
        value={taskData.project}
        onChange={handleChange}
        required
      >
        <option value="">Select Project</option>
        {projects.map(project => (
          <option key={project._id} value={project._id}>{project.name}</option>
        ))}
      </select>
      <label htmlFor="assignedTo">Assign To</label>
      <select
        id="assignedTo"
        name="assignedTo"
        value={taskData.assignedTo}
        onChange={handleChange}
      >
        <option value="">Assign To</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <div className="button-group">
        <button type="submit">{isEditing ? 'Update Task' : 'Create Task'}</button>
        <button className="cancel-button" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CreateTask;
