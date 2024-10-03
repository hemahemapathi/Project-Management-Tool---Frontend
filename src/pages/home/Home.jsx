import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { getProjects, getTasks } from '../../services/api';
import './home.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [projectTrend, setProjectTrend] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsResponse = await getProjects();
      const tasksResponse = await getTasks();

      setProjects(projectsResponse.data);
      processProjectData(projectsResponse.data);
      processTaskData(tasksResponse.data);
      processProjectTrend(projectsResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const processProjectData = (projects) => {
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    setProjectData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    });
  };

  const processTaskData = (tasks) => {
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    setTaskData({
      labels: Object.keys(priorityCounts),
      datasets: [
        {
          label: 'Task Priority Distribution',
          data: Object.values(priorityCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    });
  };

  const processProjectTrend = (projects) => {
    const monthlyProjectCounts = projects.reduce((acc, project) => {
      const date = new Date(project.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyProjectCounts).sort((a, b) => {
      const [aMonth, aYear] = a.split('/');
      const [bMonth, bYear] = b.split('/');
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
    });

    setProjectTrend({
      labels: sortedMonths,
      datasets: [
        {
          label: 'Projects Created',
          data: sortedMonths.map(month => monthlyProjectCounts[month]),
          borderColor: '#4BC0C0',
          tension: 0.1
        }
      ]
    });
  };

  const renderProjectList = () => (
    <div className="project-list">
      <h2>Recent Projects</h2>
      <ul>
        {projects.slice(0, 5).map((project) => (
          <li key={project._id}>
            <span>{project.name}</span>
            <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
              {project.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderProjectStats = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const completionRate = ((completedProjects / totalProjects) * 100).toFixed(2);

    return (
      <div className="project-stats">
        <h2>Project Statistics</h2>
        <div className="stat-item">
          <span>Total Projects:</span>
          <span>{totalProjects}</span>
        </div>
        <div className="stat-item">
          <span>Completed Projects:</span>
          <span>{completedProjects}</span>
        </div>
        <div className="stat-item">
          <span>Completion Rate:</span>
          <span>{completionRate}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-home">
      <h1>Welcome to Your Project Dashboard</h1>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="dashboard-summary">
            {renderProjectList()}
            {renderProjectStats()}
          </div>
          <div className="chart-container">
            <div className="chart">
              <h2>Project Status Distribution</h2>
              <Pie data={projectData} />
            </div>
            <div className="chart">
              <h2>Task Priority Distribution</h2>
              <Bar data={taskData} />
            </div>
            <div className="chart">
              <h2>Project Creation Trend</h2>
              <Line data={projectTrend} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;