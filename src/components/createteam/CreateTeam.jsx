  import React, { useState, useEffect } from 'react';
  import { createTeam, getUsers, updateTeam, getUserProfile } from '../../services/api';
  import './createteam.css'

  const CreateTeam = ({ onTeamCreated, teamToEdit, onTeamUpdated }) => {
    const [teamData, setTeamData] = useState({
      name: '',
      description: '',
      members: [],
    });
    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [selectedMember, setSelectedMember] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
      fetchUsers();
      fetchCurrentUser();
    }, []);

    useEffect(() => {
      if (teamToEdit && allUsers.length > 0) {
        setTeamData({
          ...teamToEdit,
          members: teamToEdit.members.map(member => {
            const user = allUsers.find(user => user._id === member._id);
            return user ? { ...member, name: user.name } : member;
          })
        });
      }
    }, [teamToEdit, allUsers]);

    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please ensure you have the necessary permissions.');
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await getUserProfile();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError('Failed to fetch current user. Please ensure you are logged in and have the necessary permissions.');
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setTeamData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };

    const handleMemberAdd = () => {
      if (selectedMember && !teamData.members.some(member => member._id === selectedMember)) {
        const memberToAdd = allUsers.find(user => user._id === selectedMember);
        if (memberToAdd) {
          setTeamData(prevData => ({
            ...prevData,
            members: [...prevData.members, memberToAdd]
          }));
          setSelectedMember('');
        }
      }
    };

    const handleMemberRemove = (memberId) => {
      setTeamData(prevData => ({
        ...prevData,
        members: prevData.members.filter(member => member._id !== memberId)
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);

      try {
        const teamDataToSend = {
          ...teamData,
          members: teamData.members.map(member => member._id)
        };

        if (teamToEdit) {
          const response = await updateTeam(teamToEdit._id, teamDataToSend);
          if (onTeamUpdated) onTeamUpdated(response.data);
          setNotification('Team updated successfully!');
        } else {
          const response = await createTeam(teamDataToSend);
          if (onTeamCreated) onTeamCreated(response.data);
          setNotification('Team created successfully!');
        }

        setTeamData({
          name: '',
          description: '',
          members: [],
        });

        setTimeout(() => {
          setNotification(null);
        }, 3000);
      } catch (error) {
        console.error('Error creating/updating team:', error);
        setError('Failed to create/update team. Please ensure you have the necessary permissions.');
      }
    };

    const availableUsers = allUsers.filter(user => !teamData.members.some(member => member._id === user._id));

    if (!currentUser) {
      return <div>Loading...</div>;
    }

    if (currentUser.role !== 'manager') {
      return <div>Only managers can create or edit teams.</div>;
    }

    return (
      <form onSubmit={handleSubmit} className="create-team-form">
        <h2>{teamToEdit ? 'Edit Team' : 'Create New Team'}</h2>
        {error && <div className="error-message">{error}</div>}
        {notification && <div className="notification-message">{notification}</div>}
        <input
          type="text"
          name="name"
          value={teamData.name || ''}
          onChange={handleChange}
          placeholder="Team Name"
          required
        />
        <textarea
          name="description"
          value={teamData.description || ''}
          onChange={handleChange}
          placeholder="Team Description"
        />
        <div className="team-members-section">
          <h3>Team Members</h3>
          <div className="team-member-input">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Select a team member</option>
              {availableUsers.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            <button type="button" onClick={handleMemberAdd}>Add</button>
          </div>
          <ul className="team-members-list">
            {teamData.members.map((member, index) => (
              <li key={`${member._id}-${index}`}>
                {member.name}
                <button type="button" onClick={() => handleMemberRemove(member._id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">{teamToEdit ? 'Update Team' : 'Create Team'}</button>
      </form>
    );
  };

  export default CreateTeam;