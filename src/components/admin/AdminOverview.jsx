import React from 'react';
import { Users, Award, FileText, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AdminOverview = () => {
  const { scholarships, applications, students } = useData();

  const totalScholarships = scholarships.length;
  const activeScholarships = scholarships.filter(s => s.status === 'active').length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => ['submitted', 'review'].includes(app.status)).length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;

  const stats = [
    {
      title: 'Total Students',
      value: students.length || 156,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Scholarships',
      value: activeScholarships,
      icon: Award,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8%'
    },
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+23%'
    },
    {
      title: 'Pending Review',
      value: pendingApplications,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '+5%'
    }
  ];

  const recentApplications = applications.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of scholarship program activities</p>
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
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="space-y-3">
            {[
              { status: 'Submitted', count: applications.filter(app => app.status === 'submitted').length, color: 'bg-blue-500' },
              { status: 'Under Review', count: applications.filter(app => app.status === 'review').length, color: 'bg-yellow-500' },
              { status: 'Interview', count: applications.filter(app => app.status === 'interview').length, color: 'bg-purple-500' },
              { status: 'Approved', count: approvedApplications, color: 'bg-green-500' },
              { status: 'Granted', count: applications.filter(app => app.status === 'granted').length, color: 'bg-emerald-500' }
            ].map(({ status, count, color }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.studentName}</p>
                    <p className="text-sm text-gray-600">{app.scholarshipTitle}</p>
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
              <p className="text-gray-500 text-center py-8">No recent applications</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center">
            <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Add New Scholarship</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Add New Course</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-center">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Review Applications</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;