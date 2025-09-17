import React from 'react';
import { Award, FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const Overview = () => {
  const { scholarships, applications } = useData();
  const { user } = useAuth();

  const userApplications = applications.filter(app => app.studentId === user?.id);
  const activeScholarships = scholarships.filter(s => s.status === 'active');
  const approvedApplications = userApplications.filter(app => app.status === 'approved');
  const pendingApplications = userApplications.filter(app => ['submitted', 'review', 'interview'].includes(app.status));

  const stats = [
    {
      title: 'Available Scholarships',
      value: activeScholarships.length,
      icon: Award,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'My Applications',
      value: userApplications.length,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Review',
      value: pendingApplications.length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Approved',
      value: approvedApplications.length,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Track your scholarship journey</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {userApplications.length > 0 ? (
              userApplications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.scholarshipTitle}</p>
                    <p className="text-sm text-gray-600">Applied on {new Date(app.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No applications yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Scholarships</h3>
          <div className="space-y-4">
            {activeScholarships.slice(0, 3).map((scholarship) => (
              <div key={scholarship.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{scholarship.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{scholarship.amount}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Deadline: {new Date(scholarship.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;