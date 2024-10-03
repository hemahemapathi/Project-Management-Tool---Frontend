import React, { useState, useEffect } from 'react';
import { getReports, deleteReport, getReport } from '../../services/api';
import { Table, Button, message, Empty, Modal } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import CreateReport from '../createreport/CreateReport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      message.error('Failed to fetch reports');
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await deleteReport(reportId);
      message.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      message.error('Failed to delete report');
    }
  };

  const handleView = async (reportId) => {
    try {
      const response = await getReport(reportId);
      setSelectedReport(response.data);
      setIsModalOpen(true);
      prepareChartData(response.data);
    } catch (error) {
      console.error('Error fetching report details:', error);
      message.error('Failed to fetch report details');
    }
  };

  const prepareChartData = (report) => {
    if (report && report.data) {
      const labels = Object.keys(report.data);
      const data = Object.values(report.data);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: `${report.type} Report Data`,
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          },
        ],
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setChartData(null);
  };

  const handleCreateReport = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    fetchReports();
  };

  const columns = [
    {
      title: 'Project',
      dataIndex: ['project', 'name'],
      key: 'project',
      render: (text, record) => record.project?.name || 'N/A',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Created By',
      dataIndex: ['generatedBy', 'name'],
      key: 'generatedBy',
      render: (text, record) => record.generatedBy?.name || 'N/A',
    },
    {
      title: 'Created At',
      dataIndex: 'generatedAt',
      key: 'generatedAt',
      render: (text) => {
        if (!text) return 'N/A';
        const date = new Date(text);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record._id)}>
            View
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Reports</h1>
      <Button onClick={handleCreateReport} style={{ marginBottom: '16px' }}>
        Create New Report
      </Button>
      <Table
        columns={columns}
        dataSource={reports}
        rowKey="_id"
        loading={loading}
        locale={{
          emptyText: <Empty description="No reports found" />
        }}
      />
      <Modal
        title="Report Details"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedReport && (
          <div>
            {chartData && (
              <div>
                <h3>{selectedReport.type} Report</h3>
                <Line data={chartData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Report Data',
                    },
                  },
                }} />
              </div>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="Create Report"
        open={isCreateModalOpen}
        onCancel={handleCreateModalClose}
        footer={null}
        width={600}
      >
        <CreateReport
          onClose={handleCreateModalClose}
        />
      </Modal>
    </div>
  );
};

export default ReportList;