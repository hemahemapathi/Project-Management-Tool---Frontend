import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const hiddenPaths = ['/', '/register', '/login'];

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const handleLinkClick = () => {
    toggleSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>×</button>
      <nav>
        <ul>
          <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
          <li><Link to="/projects" onClick={handleLinkClick}>Projects</Link></li>
          <li><Link to="/tasks" onClick={handleLinkClick}>Tasks</Link></li>
          <li><Link to="/team" onClick={handleLinkClick}>Team</Link></li>
          <li><Link to="/reports" onClick={handleLinkClick}>Reports</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;