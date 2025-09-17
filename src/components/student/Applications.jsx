import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationModal from './ApplicationModal';

const Applications = () => {
  const { applications } = useData();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('all');

  // ✅ Added missing states
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const userApplications = applications.filter(app => app.studentId === user?.id);

  const filteredApplications = selectedStatus === 'all' 
    ? userApplications 
    : userApplications.filter(app => app.status === selectedStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'review': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'interview': return <User className="w-5 h-5 text-purple-600" />;
      case 'approved': 
      case 'granted': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'approved': 
      case 'granted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    all: userApplications.length,
    submitted: userApplications.filter(app => app.status === 'submitted').length,
    review: userApplications.filter(app => app.status === 'review').length,
    interview: userApplications.filter(app => app.status === 'interview').length,
    approved: userApplications.filter(app => app.status === 'approved').length,
    granted: userApplications.filter(app => app.status === 'granted').length,
    rejected: userApplications.filter(app => app.status === 'rejected').length,
  };

  // ✅ Open modal
  const handleViewApplication = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowApplicationModal(true);
  };

  // ✅ Example submit handler
  const handleSubmitApplication = (data) => {
    console.log("Application submitted:", data);
    setShowApplicationModal(false);
    setSelectedScholarship(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your scholarship applications</p>
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
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({statusCounts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application, index) => (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
                    {getStatusIcon(application.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {application.scholarshipTitle}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Applied on {new Date(application.submittedAt).toLocaleDateString()}</span>
                      </div>
                      {application.updatedAt && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Last updated {new Date(application.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  {/* 👁 Eye button opens modal */}
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => handleViewApplication(application)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  {['submitted', 'review', 'interview', 'approved', 'granted'].map((step, stepIndex) => {
                    const isCompleted = ['submitted', 'review', 'interview', 'approved', 'granted'].indexOf(application.status) >= stepIndex;
                    const isCurrent = application.status === step;
                    
                    return (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                          isCompleted || isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {stepIndex + 1}
                        </div>
                        {stepIndex < 4 && (
                          <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                            isCompleted && !isCurrent ? 'bg-blue-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Submitted</span>
                  <span>Review</span>
                  <span>Interview</span>
                  <span>Approved</span>
                  <span>Granted</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedStatus === 'all' ? 'No applications yet' : `No ${selectedStatus} applications`}
            </h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? 'Start by applying for available scholarships.' 
                : `You don't have any applications with ${selectedStatus} status.`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showApplicationModal && (
        <ApplicationModal
          scholarship={selectedScholarship}
          onSubmit={handleSubmitApplication}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedScholarship(null);
          }}
        />
      )}
    </div>
  );
};

export default Applications;
