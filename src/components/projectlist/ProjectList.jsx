import React, { useState, useEffect } from 'react';
import { getProjects, deleteProject, getTeams } from '../../services/api';
import FilterSort from '../filtersort/FilterSort';
import { filterProjects, sortProjects } from '../../services/filter';
import CreateProject from '../createproject/CreateProject';
import { Toast, Dropdown } from 'react-bootstrap';
import './projectlist.css'

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user ? user.user.role : null);
  }, []);
  
  useEffect(() => {
    let result = filterProjects(projects, filter);
    result = sortProjects(result, sort);
    setFilteredProjects(result);
  }, [projects, filter, sort]);

  const fetchProjects = async () => {
    const response = await getProjects();
    const updatedProjects = response.data.map(project => ({
      ...project,
      isCompleted: new Date(project.endDate) < new Date() && project.status !== 'Completed',
      remainingDays: calculateRemainingDays(project.endDate)
    }));
    setProjects(updatedProjects);
  };

  const fetchTeamMembers = async () => {
    const response = await getTeams();
    setTeamMembers(response.data);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      fetchProjects();
      showNotification('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      if (error.response && error.response.status === 403) {
        showNotification('You do not have permission to delete this project');
      } else {
        showNotification('Error deleting project');
      }
    }
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setShowCreateProject(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    const updatedProjectWithRemainingDays = {
      ...updatedProject,
      isCompleted: new Date(updatedProject.endDate) < new Date() && updatedProject.status !== 'Completed',
      remainingDays: calculateRemainingDays(updatedProject.endDate)
    };
    setProjects(prevProjects => prevProjects.map(p => p._id === updatedProject._id ? updatedProjectWithRemainingDays : p));
    setProjectToEdit(null);
    setShowCreateProject(false);
    showNotification('Project updated successfully');
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleCancel = () => {
    setProjectToEdit(null);
    setShowCreateProject(false);
  };

  const filters = ['In-Progress', 'Completed', 'Not Started'];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'endDate', label: 'End Date' },
    { value: 'status', label: 'Status' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const calculateRemainingDays = (endDate) => {
    const today = new Date();
    const dueDate = new Date(endDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  return (
    <div className="project-list">
      <h1>Projects</h1>
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
      </div>
      {userRole === 'manager' && !projectToEdit && (
        <div className="create-project-button">
          <button onClick={() => setShowCreateProject(!showCreateProject)}>New Project</button>
        </div>
      )}
      {showCreateProject 
      && <CreateProject 
      onProjectCreated={fetchProjects}
      projectToEdit={projectToEdit}
      onProjectUpdated={handleProjectUpdated}
      teamMembers={teamMembers}
      onCancel={handleCancel}
       />}
      <div className="project-list-items">
        {filteredProjects.map((project) => (
          <div key={project._id} className="project-item">
            <span className="project-name">{project.name}</span>
            <span className="project-status">{project.status}</span>
            <span className="project-description">{project.description}</span>
            <span className="project-end-date">End Date: {formatDate(project.endDate)}</span>
            <span className="project-remaining-days">Due in: {project.remainingDays} days</span>
            {project.isCompleted && <span className="project-overdue">Overdue</span>}
            {userRole === 'manager' && (
              <div className="project-actions">
                <button className="edit-button" onClick={() => handleEditProject(project)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteProject(project._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
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

export default ProjectList;