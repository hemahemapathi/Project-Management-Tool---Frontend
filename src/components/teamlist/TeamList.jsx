  import React, { useState, useEffect } from 'react';
  import { getTeams, getTeamById, deleteTeam, getUserProfile } from '../../services/api';
  import { Table, Button, Modal, Toast } from 'react-bootstrap';
  import CreateTeam from '../createteam/CreateTeam';
  import './teamlist.css'

  const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [teamToEdit, setTeamToEdit] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
      fetchTeams();
      checkUserRole();
    }, []);

    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const checkUserRole = async () => {
      try {
        const user = await getUserProfile();
        setIsManager(user.data.role === 'manager');
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    const handleViewMembers = async (teamId) => {
      try {
        const response = await getTeamById(teamId);
        setSelectedTeam(response.data);
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedTeam(null);
    };

    const handleDeleteTeam = async (teamId) => {
      try {
        await deleteTeam(teamId);
        fetchTeams();
        showNotification('Team deleted successfully');
      } catch (error) {
        console.error('Error deleting team:', error);
        showNotification('Error deleting team');
      }
    };

    const handleCreateTeam = () => {
      setTeamToEdit(null);
      setShowCreateModal(true);
    };

    const handleEditTeam = (team) => {
      setTeamToEdit(team);
      setShowCreateModal(true);
    };

    const handleTeamCreated = (newTeam) => {
      setTeams([...teams, newTeam]);
      setShowCreateModal(false);
      showNotification('Team created successfully');
    };

    const handleTeamUpdated = (updatedTeam) => {
      setTeams(teams.map(team => team._id === updatedTeam._id ? updatedTeam : team));
      setShowCreateModal(false);
      showNotification('Team updated successfully');
    };

    const showNotification = (message) => {
      setToastMessage(message);
      setShowToast(true);
    };

    return (
      <div className="team-list-container">
        <h2 className="team-list-title">Teams</h2>
        {isManager && (
          <div className="create-team-button">
            <Button variant="primary" onClick={handleCreateTeam} className="mb-3">
              Create New Team
            </Button>
          </div>
        )}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team._id}>
                <td>{team.name}</td>
                <td>
                  <div className="team-actions">
                    <Button variant="info" onClick={() => handleViewMembers(team._id)}>
                      View Members
                    </Button>
                    {isManager && (
                      <>
                        <Button variant="warning" onClick={() => handleEditTeam(team)} className="ml-2">
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteTeam(team._id)} className="ml-2">
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTeam?.name} Members</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTeam?.members.map((member) => (
              <div key={member._id} className="member-info">
                <div className="member-name">Name: {member.name}</div>
                <div className="member-email">Email: {member.email}</div>
                <hr />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {isManager && (
          <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{teamToEdit ? 'Edit Team' : 'Create New Team'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreateTeam
                onTeamCreated={handleTeamCreated}
                onTeamUpdated={handleTeamUpdated}
                teamToEdit={teamToEdit}
              />
            </Modal.Body>
          </Modal>
        )}

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

  export default TeamList;