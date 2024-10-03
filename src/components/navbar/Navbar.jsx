import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Welcome Home</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <span className="nav-item nav-link">
                <FontAwesomeIcon icon={faUser} /> Welcome, {user.name || 'User'}
              </span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item nav-link">
                <button className="btn btn-outline-primary">
                  <FontAwesomeIcon icon={faSignInAlt} /> Login
                </button>
              </Link>
              <Link to="/register" className="nav-item nav-link">
                <button className="btn btn-outline-success">
                  <FontAwesomeIcon icon={faUserPlus} /> Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;