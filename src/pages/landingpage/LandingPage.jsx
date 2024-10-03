import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './landingpage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="content">
        <h1 className="animate-fade-in">Welcome to Our Project Management System</h1>
        <p className="animate-slide-up">Streamline your projects and boost productivity with our powerful tools</p>
        <div className="features animate-slide-up">
          <div className="feature">
            <h3>Task Management</h3>
            <p>Organize and prioritize tasks effortlessly</p>
          </div>
          <div className="feature">
            <h3>Team Collaboration</h3>
            <p>Work together seamlessly with real-time updates</p>
          </div>
          <div className="feature">
            <h3>Progress Tracking</h3>
            <p>Monitor project progress with intuitive dashboards</p>
          </div>
        </div>
        <div className="cta-buttons animate-fade-in">
          <Button type="primary">
            <Link to="/login">Login</Link>
          </Button>
          <Button>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
