import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Clock, User, Search, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import ApplicationDetailsModal from './ApplicationDetailsModal';

const ManageApplications = () => {
  const { applications, updateApplicationStatus } = useData();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.scholarshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.studentNumber.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (applicationId, newStatus) => {
    updateApplicationStatus(applicationId, newStatus);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'interview':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'granted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(app => app.status === 'submitted').length,
    review: applications.filter(app => app.status === 'review').length,
    interview: applications.filter(app => app.status === 'interview').length,
    approved: applications.filter(app => app.status === 'approved').length,
    granted: applications.filter(app => app.status === 'granted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
          <p className="text-gray-600 mt-1">Review and process scholarship applications</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'review', label: 'Under Review' },
            { key: 'interview', label: 'Interview' },
            { key: 'approved', label: 'Approved' },
            { key: 'granted', label: 'Granted' },
            { key: 'rejected', label: 'Rejected' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedStatus === key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({statusCounts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scholarship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{application.studentName}</div>
                      <div className="text-sm text-gray-500">{application.studentNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{application.scholarshipTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {application.status === 'submitted' && (
                        <button
                          onClick={() => handleStatusChange(application.id, 'review')}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors"
                        >
                          Start Review
                        </button>
                      )}
                      
                      {application.status === 'review' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleStatusChange(application.id, 'interview')}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                          >
                            Interview
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'approved')}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {application.status === 'interview' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleStatusChange(application.id, 'approved')}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {application.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(application.id, 'granted')}
                          className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-colors"
                        >
                          Grant
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'No applications have been submitted yet.' 
                : `No applications with ${selectedStatus} status.`}
            </p>
          </div>
        )}
      </div>

      {showDetailsModal && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onStatusChange={handleStatusChange}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageApplications;