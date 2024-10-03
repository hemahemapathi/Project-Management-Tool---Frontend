import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import Footer from './components/footer/Footer.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Home from './pages/home/Home.jsx';
import ProjectList from './components/projectlist/ProjectList.jsx';
import TaskList from './components/tasklist/TaskList.jsx';
import TeamList from './components/teamlist/TeamList.jsx';
import ReportList from './components/reportlist/ReportList.jsx';
import Sidebar from './components/sidebar/Sidebar.jsx';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const SidebarWrapper = () => {
    const location = useLocation();
    const hideSidebarPaths = ['/', '/register', '/login'];
    const showSidebar = !hideSidebarPaths.includes(location.pathname);

    return showSidebar ? (
      <>
        <button onClick={toggleSidebar}>☰</button>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </>
    ) : null;
  }

  return (
    <Router>
      <div className="App">
        <SidebarWrapper />
        <main className={isSidebarOpen ? 'content-shift' : ''}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="team" element={<TeamList />} />
            <Route path="reports" element={<ReportList />} />
          </Route>
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/team" element={<TeamList />} />
          <Route path="/reports" element={<ReportList />} />
        </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;