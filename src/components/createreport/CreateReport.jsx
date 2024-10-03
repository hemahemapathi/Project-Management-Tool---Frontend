import React, { useState, useEffect } from 'react'
import { createReport, getProjects, getUserProfile } from '../../services/api'
import './createreport.css'
import { Dropdown } from 'react-bootstrap'

const CreateReport = () => {
  const [reportType, setReportType] = useState('')
  const [reportData, setReportData] = useState({})
  const [message, setMessage] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchCurrentUser()
    updateCurrentDate()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await getProjects()
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setMessage('Error fetching projects: ' + error.message)
      setProjects([])
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await getUserProfile()
      setCurrentUser(response.data.username)
    } catch (error) {
      console.error('Error fetching current user:', error)
      setMessage('Error fetching current user: ' + error.message)
    }
  }

  const updateCurrentDate = () => {
    const currentDate = new Date().toISOString().split('T')[0]
    setReportData(prevData => ({ ...prevData, generatedAt: currentDate }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await createReport({ projectId: selectedProjectId, type: reportType, data: reportData })
      setMessage('Report created successfully')
      setReportType('')
      setReportData({})
      setSelectedProjectId('')
      updateCurrentDate()
    } catch (error) {
      setMessage('Error creating report: ' + error.message)
    }
  }

  const renderReportFields = () => {
    switch (reportType) {
      case 'Progress':
        return (
          <div className="progress-fields">
            <label htmlFor="totalTasks">Total Tasks:</label>
            <input
              id="totalTasks"
              type="number"
              placeholder="Total Tasks"
              value={reportData.totalTasks || ''}
              onChange={(e) => {
                const totalTasks = parseInt(e.target.value);
                const completedTasks = reportData.completedTasks || 0;
                const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                const remainingTasks = totalTasks - completedTasks;
                setReportData({
                  ...reportData,
                  totalTasks,
                  progressPercentage,
                  remainingTasks
                });
              }}
            />
            <label htmlFor="completedTasks">Completed Tasks:</label>
            <input
              id="completedTasks"
              type="number"
              placeholder="Completed Tasks"
              value={reportData.completedTasks || ''}
              onChange={(e) => {
                const completedTasks = parseInt(e.target.value);
                const totalTasks = reportData.totalTasks || 0;
                const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                const remainingTasks = totalTasks - completedTasks;
                setReportData({
                  ...reportData,
                  completedTasks,
                  progressPercentage,
                  remainingTasks
                });
              }}
            />
            <label htmlFor="progressPercentage">Progress Percentage:</label>
            <input
              id="progressPercentage"
              type="number"
              placeholder="Progress Percentage"
              value={reportData.progressPercentage || ''}
              readOnly
            />
            <label htmlFor="remainingTasks">Remaining Tasks:</label>
            <input
              id="remainingTasks"
              type="number"
              placeholder="Remaining Tasks"
              value={reportData.remainingTasks || ''}
              readOnly
            />
            <label htmlFor="generatedAt">Generated At:</label>
            <input
              id="generatedAt"
              type="date"
              placeholder="Generated At"
              value={reportData.generatedAt || ''}
              readOnly
            />
          </div>
        );
      case 'TaskCompletion':
        return (
          <div className="task-completion-fields">
            <label htmlFor="taskId">Task Name:</label>
            <input
              id="taskId"
              type="text"
              placeholder="Task Name"
              value={reportData.taskId || ''}
              onChange={(e) => setReportData({...reportData, taskId: e.target.value})}
            />
            <label htmlFor="completedDate">Completed Date:</label>
            <input
              id="completedDate"
              type="date"
              placeholder="Completed Date"
              value={reportData.completedDate || reportData.generatedAt || ''}
              onChange={(e) => setReportData({...reportData, completedDate: e.target.value})}
            />
            <label htmlFor="totalCompleted">Total Completed:</label>
            <input
              id="totalCompleted"
              type="number"
              placeholder="Total Completed"
              value={reportData.totalCompleted || ''}
              onChange={(e) => setReportData({...reportData, totalCompleted: parseInt(e.target.value)})}
            />
          </div>
        );
      case 'Timeline':
        return (
          <div className="timeline-fields">
            <label htmlFor="projectStartDate">Project Start Date:</label>
            <input
              id="projectStartDate"
              type="date"
              placeholder="Project Start Date"
              value={reportData.projectStartDate || ''}
              onChange={(e) => setReportData({...reportData, projectStartDate: e.target.value})}
            />
            <label htmlFor="projectEndDate">Project End Date:</label>
            <input
              id="projectEndDate"
              type="date"
              placeholder="Project End Date"
              value={reportData.projectEndDate || ''}
              onChange={(e) => setReportData({...reportData, projectEndDate: e.target.value})}
            />
            <h4>Milestones</h4>
            {(reportData.milestones || []).map((milestone, index) => (
              <div key={index} className="milestone-item">
                <label htmlFor={`milestoneTitle${index}`}>Milestone Title:</label>
                <input
                  id={`milestoneTitle${index}`}
                  type="text"
                  placeholder="Milestone Title"
                  value={milestone.title || ''}
                  onChange={(e) => {
                    const newMilestones = [...(reportData.milestones || [])];
                    newMilestones[index] = { ...newMilestones[index], title: e.target.value };
                    setReportData({ ...reportData, milestones: newMilestones });
                  }}
                />
                <label htmlFor={`milestoneDate${index}`}>Milestone Date:</label>
                <input
                  id={`milestoneDate${index}`}
                  type="date"
                  placeholder="Milestone Date"
                  value={milestone.date ? milestone.date.split('T')[0] : new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newMilestones = [...(reportData.milestones || [])];
                    newMilestones[index] = { ...newMilestones[index], date: e.target.value + 'T00:00:00.000Z' };
                    setReportData({ ...reportData, milestones: newMilestones });
                  }}
                />
                <label htmlFor={`milestoneStatus${index}`}>Milestone Status:</label>
                <input
                  id={`milestoneStatus${index}`}
                  type="text"
                  placeholder="Milestone Status"
                  value={milestone.status || ''}
                  onChange={(e) => {
                    const newMilestones = [...(reportData.milestones || [])];
                    newMilestones[index] = { ...newMilestones[index], status: e.target.value };
                    setReportData({ ...reportData, milestones: newMilestones });
                  }}
                />
                <button type="button" onClick={() => {
                  const newMilestones = [...(reportData.milestones || [])];
                  newMilestones.splice(index, 1);
                  setReportData({ ...reportData, milestones: newMilestones });
                }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setReportData({ ...reportData, milestones: [...(reportData.milestones || []), { title: '', date: '', status: '' }] })}>
              Add Milestone
            </button>
          </div>
        );
      case 'BudgetUtilization':
        return (
          <div className="budget-utilization-fields">
            <label htmlFor="totalBudget">Total Budget:</label>
            <input
              id="totalBudget"
              type="number"
              placeholder="Total Budget"
              value={reportData.totalBudget || ''}
              onChange={(e) => {
                const totalBudget = parseFloat(e.target.value);
                const spentToDate = reportData.spentToDate || 0;
                const remainingBudget = totalBudget - spentToDate;
                const utilizationPercentage = totalBudget > 0 ? Math.round((spentToDate / totalBudget) * 100) : 0;
                setReportData({
                  ...reportData,
                  totalBudget,
                  remainingBudget,
                  utilizationPercentage
                });
              }}
            />
            <label htmlFor="spentToDate">Spent To Date:</label>
            <input
              id="spentToDate"
              type="number"
              placeholder="Spent To Date"
              value={reportData.spentToDate || ''}
              onChange={(e) => {
                const spentToDate = parseFloat(e.target.value);
                const totalBudget = reportData.totalBudget || 0;
                const remainingBudget = totalBudget - spentToDate;
                const utilizationPercentage = totalBudget > 0 ? Math.round((spentToDate / totalBudget) * 100) : 0;
                setReportData({
                  ...reportData,
                  spentToDate,
                  remainingBudget,
                  utilizationPercentage
                });
              }}
            />
            <label htmlFor="remainingBudget">Remaining Budget:</label>
            <input
              id="remainingBudget"
              type="number"
              placeholder="Remaining Budget"
              value={reportData.remainingBudget || ''}
              readOnly
            />
            <label htmlFor="utilizationPercentage">Utilization Percentage:</label>
            <input
              id="utilizationPercentage"
              type="number"
              placeholder="Utilization Percentage"
              value={reportData.utilizationPercentage || ''}
              readOnly
            />
            <h4>Major Expenses</h4>
            {(reportData.majorExpenses || []).map((expense, index) => (
              <div key={index} className="major-expense-item">
                <label htmlFor={`expenseCategory${index}`}>Category:</label>
                <input
                  id={`expenseCategory${index}`}
                  type="text"
                  placeholder="Category"
                  value={expense.category || ''}
                  onChange={(e) => {
                    const newExpenses = [...(reportData.majorExpenses || [])];
                    newExpenses[index] = { ...newExpenses[index], category: e.target.value };
                    setReportData({ ...reportData, majorExpenses: newExpenses });
                  }}
                />
                <label htmlFor={`expenseAmount${index}`}>Amount:</label>
                <input
                  id={`expenseAmount${index}`}
                  type="number"
                  placeholder="Amount"
                  value={expense.amount || ''}
                  onChange={(e) => {
                    const newExpenses = [...(reportData.majorExpenses || [])];
                    newExpenses[index] = { ...newExpenses[index], amount: parseFloat(e.target.value) };
                    setReportData({ ...reportData, majorExpenses: newExpenses });
                  }}
                />
                <button type="button" onClick={() => {
                  const newExpenses = [...(reportData.majorExpenses || [])];
                  newExpenses.splice(index, 1);
                  setReportData({ ...reportData, majorExpenses: newExpenses });
                }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setReportData({ ...reportData, majorExpenses: [...(reportData.majorExpenses || []), { category: '', amount: 0 }] })}>
              Add Major Expense
            </button>
          </div>
        );
      case 'TaskUpdate':
        return (
          <div className="task-update-fields">
            <label htmlFor="taskName">Task Name:</label>
            <input
              id="taskName"
              type="text"
              placeholder="Task Name"
              value={reportData.taskName || ''}
              onChange={(e) => setReportData({...reportData, taskName: e.target.value})}
            />
            <label htmlFor="status">Status:</label>
            <input
              id="status"
              type="text"
              placeholder="Status"
              value={reportData.status || ''}
              onChange={(e) => setReportData({...reportData, status: e.target.value})}
            />
            <label htmlFor="dueDate">Due Date:</label>
            <input
              id="dueDate"
              type="date"
              placeholder="Due Date"
              value={reportData.dueDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setReportData({...reportData, dueDate: e.target.value})}
            />
          </div>
        );
      default:
        return null;
    }
  }

  const reportTypes = [
    { value: 'Progress', label: 'Project Progress' },
    { value: 'TaskCompletion', label: 'Task Completion' },
    { value: 'Timeline', label: 'Timeline' },
    { value: 'BudgetUtilization', label: 'Budget Utilization' },
    { value: 'TaskUpdate', label: 'Task Update' }
  ]

  return (
    <div className="create-report-container">
      <h2>Create Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-project">
              Project: {selectedProjectId ? projects.find(p => p._id === selectedProjectId)?.name : 'Select Project'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {projects.map((project) => (
                <Dropdown.Item key={project._id} onClick={() => setSelectedProjectId(project._id)}>{project.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-report-type">
              Report Type: {reportType ? reportTypes.find(type => type.value === reportType).label : 'Select Report Type'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {reportTypes.map((type) => (
                <Dropdown.Item key={type.value} onClick={() => setReportType(type.value)}>{type.label}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {renderReportFields()}
          <button type="submit">Create Report</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default CreateReport
