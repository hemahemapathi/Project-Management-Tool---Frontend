import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth.js';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(email, password);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <input
              type="email"
              id="email"
              name="email"
              className="input-field"
              placeholder="Email Address"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <button type="submit" className="submit-button">
            Login
          </button>
          <button type="button" className="register-button" onClick={handleRegister}>
           Don't have an account? Register here
          </button>
        </form>
      </div>
  );
};

export default Login;