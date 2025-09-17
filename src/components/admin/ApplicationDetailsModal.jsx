import React from 'react';
import { X, User, Award, Calendar, FileText, DollarSign, GraduationCap } from 'lucide-react';

const ApplicationDetailsModal = ({ application, onStatusChange, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
              <p className="text-gray-600 text-sm">{application.scholarshipTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900 mt-1">{application.studentName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Number</label>
                <p className="text-gray-900 mt-1">{application.studentNumber}</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Application Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Personal Statement</label>
                <p className="text-gray-900 mt-1 bg-white p-3 rounded-lg border">
                  {application.essay || 'No personal statement provided.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current GPA</label>
                  <p className="text-gray-900 mt-1">{application.gpa || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Family Monthly Income</label>
                  <p className="text-gray-900 mt-1">₱{application.familyIncome || 'Not provided'}</p>
                </div>
              </div>

              {application.additionalInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                  <p className="text-gray-900 mt-1 bg-white p-3 rounded-lg border">{application.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Submitted Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {application.documents && Object.entries(application.documents).map(([key, file]) => (
                file && (
                  <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900 capitalize">{key}</span>
                    </div>
                    <p className="text-xs text-gray-600">{file.name}</p>
                    <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700">
                      View Document
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Status and Timeline */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Application Timeline
            </h3>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-700">Current Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-6">
              {['submitted', 'review', 'interview', 'approved', 'granted'].map((step, stepIndex) => {
                const isCompleted = ['submitted', 'review', 'interview', 'approved', 'granted'].indexOf(application.status) >= stepIndex;
                const isCurrent = application.status === step;
                
                return (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepIndex + 1}
                    </div>
                    {stepIndex < 4 && (
                      <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                        isCompleted && !isCurrent ? 'bg-indigo-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {application.status === 'submitted' && (
                <button
                  onClick={() => onStatusChange(application.id, 'review')}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  Start Review
                </button>
              )}
              
              {application.status === 'review' && (
                <>
                  <button
                    onClick={() => onStatusChange(application.id, 'interview')}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => onStatusChange(application.id, 'approved')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusChange(application.id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              
              {application.status === 'interview' && (
                <>
                  <button
                    onClick={() => onStatusChange(application.id, 'approved')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusChange(application.id, 'rejected')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              
              {application.status === 'approved' && (
                <button
                  onClick={() => onStatusChange(application.id, 'granted')}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                >
                  Grant Scholarship
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;