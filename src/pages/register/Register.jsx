import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth.js';
import './register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (role === 'team_member' && !email.toLowerCase().endsWith('@example.com')) {
      setError('Team members must use an email ending with @example.com');
      return;
    }
    if (role === 'manager' && !email.toLowerCase().endsWith('@manager.com')) {
      setError('Managers must use an email ending with @manager.com');
      return;
    }
    try {
      await registerUser(name, email, password, role);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.message.includes('duplicate key error')) {
        setError('An account with this email already exists. Please use a different email.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
      <div className="register-box">
        <h1 className="register-title">Register</h1>
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                required
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field">
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field">
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-field">
            <div className="input-wrapper">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="team_member">Team Member</option>
              </select>
            </div>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <button type="submit" className="register-button">
            Register
          </button>
          <button type="button" className="login-button" onClick={handleLogin}>
            Already have an account? Login
          </button>
        </form>
      </div>
  );
};

export default Register;