import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getUsers, updateProject } from '../../services/api';
import './createproject.css'

const CreateProject = ({ onProjectCreated, projectToEdit, onProjectUpdated, onCancel }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Not Started',
    priorityLevel: 'Medium',
    budget: 0,
    fileUpload: '',
    riskAssessment: '',
    manager: '',
    team_members: [],
    remainingDays: null,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchUsers();
    if (projectToEdit) {
      setProjectData({
        ...projectToEdit,
        startDate: formatDateForInput(projectToEdit.startDate),
        endDate: formatDateForInput(projectToEdit.endDate),
      });
    }
  }, [projectToEdit]);

  useEffect(() => {
    calculateRemainingDays();
  }, [projectData.endDate]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const teamMembers = response.data.filter(user => user.role === 'team_member');
      setAllUsers(teamMembers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const calculateRemainingDays = () => {
    if (projectData.endDate) {
      const today = new Date();
      const endDate = new Date(projectData.endDate);
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setProjectData(prevData => ({
        ...prevData,
        remainingDays: daysDiff > 0 ? daysDiff : 0
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prevData => ({
      ...prevData,
      [name]: name.includes('Date') ? (value ? new Date(value).toISOString() : '') : value
    }));
  };

  const handleTeamMemberAdd = () => {
    if (selectedMember && !projectData.team_members.some(member => member._id === selectedMember)) {
      const memberToAdd = allUsers.find(user => user._id === selectedMember);
      setProjectData(prevData => ({
        ...prevData,
        team_members: [...prevData.team_members, memberToAdd]
      }));
      setSelectedMember('');
    }
  };

  const handleTeamMemberRemove = (memberId) => {
    setProjectData(prevData => ({
      ...prevData,
      team_members: prevData.team_members.filter(member => member._id !== memberId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (projectToEdit) {
        const response = await updateProject(projectToEdit._id, projectData);
        if (response.status === 200) {
          if (onProjectUpdated) onProjectUpdated(response.data);
          setNotification('Project updated successfully!');
        } else {
          throw new Error('Failed to update project');
        }
      } else {
        const response = await createProject(projectData);
        if (response.status === 201) {
          if (onProjectCreated) onProjectCreated(response.data);
          setNotification('Project created successfully!');
        } else {
          throw new Error('Failed to create project');
        }
      }

      setProjectData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Not Started',
        priorityLevel: 'Medium',
        budget: '',
        fileUpload: '',
        riskAssessment: '',
        manager: '',
        team_members: [],
        remainingDays: null,
      });

      // Clear the notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error creating/updating project:', error);
      setError('Failed to create/update project. Please check your permissions and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (projectToEdit && onCancel) {
      onCancel();
    } else if (onCancel) {
      onCancel();
    } else {
      navigate('/projects');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-project-form">
      <h2>{projectToEdit ? 'Edit This Project' : 'Create New Project'}</h2>
      {error && <div className="error-message">{error}</div>}
      {notification && <div className="notification-message">{notification}</div>}
      <div>
        <label htmlFor="name">Project Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={projectData.name || ''}
          onChange={handleChange}
          placeholder="Project Name"
          required
        />
      </div>
      <div>
        <label htmlFor="description">Project Description:</label>
        <textarea
          id="description"
          name="description"
          value={projectData.description || ''}
          onChange={handleChange}
          placeholder="Project Description"
        />
      </div>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formatDateForInput(projectData.startDate) || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formatDateForInput(projectData.endDate) || ''}
          onChange={handleChange}
        />
      </div>
      {projectData.remainingDays !== null && (
        <div>
          <label>Remaining Days:</label>
          <span>{projectData.remainingDays}</span>
        </div>
      )}
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={projectData.status || ''}
          onChange={handleChange}
          required
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In-Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <label htmlFor="priorityLevel">Priority Level:</label>
        <select
          id="priorityLevel"
          name="priorityLevel"
          value={projectData.priorityLevel || ''}
          onChange={handleChange}
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      <div>
        <label htmlFor="budget">Budget:</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={projectData.budget || 0}
          onChange={handleChange}
          placeholder="Budget"
          min="0"
        />
      </div>
      <div>
        <label htmlFor="fileUpload">File Upload:</label>
        <input
          type="text"
          id="fileUpload"
          name="fileUpload"
          value={projectData.fileUpload || ''}
          onChange={handleChange}
          placeholder="File Upload"
        />
      </div>
      <div>
        <label htmlFor="riskAssessment">Risk Assessment:</label>
        <textarea
          id="riskAssessment"
          name="riskAssessment"
          value={projectData.riskAssessment || ''}
          onChange={handleChange}
          placeholder="Risk Assessment"
        />
      </div>
      <div className="team-members-section">
        <h3>Team Members</h3>
        <div className="team-member-input">
          <label htmlFor="teamMember">Select Team Member:</label>
          <select
            id="teamMember"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select a team member</option>
            {allUsers.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
          </select>
          <button type="button" onClick={handleTeamMemberAdd}>Add</button>
        </div>
        <ul className="team-members-list">
        {projectData.team_members.map(member => (
          <li key={member._id}>
            {member.name}
            <button type="button" onClick={() => handleTeamMemberRemove(member._id)}>Remove</button>
          </li>
        ))}
        </ul>
      </div>
      <div className="form-buttons">
        {!isSubmitting && (
          <button type="submit">{projectToEdit ? 'Update Project' : 'Create Project'}</button>
        )}
        <button className="cancel-button" type="button" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CreateProject;