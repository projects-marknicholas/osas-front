import React, { useState, useEffect } from 'react';
import { 
  Users, Award, FileText, TrendingUp, Calendar, Megaphone, 
  ChevronRight, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { getDashboardStats } from '../../api/admin';
import { getAnnouncements } from '../../api/admin';

const AdminOverview = () => {
  const { scholarships, applications, students } = useData();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [announcements, setAnnouncements] = useState([]);

  // Generate 50 years (from 1976 to 2026)
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 98 + i);

  useEffect(() => {
    fetchDashboardData();
    fetchAnnouncements();
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats(selectedYear);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      // Call getAnnouncements with proper parameters
      const response = await getAnnouncements({ 
        page: 1, 
        limit: 3, // Only show 3 most recent announcements
        search: "" 
      });
      
      if (response && response.success) {
        setAnnouncements(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error("Failed to fetch announcements:", response);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setAnnouncements([]);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Failed to load dashboard data</div>
      </div>
    );
  }

  const { stats } = dashboardData;

  const statsData = [
    {
      title: 'Total Students',
      value: stats.totals.students,
      icon: Users,
      color: 'bg-[#2bb9c5]',
      iconColor: 'text-[#2bb9c5]'
    },
    {
      title: 'Total Scholars',
      value: stats.totals.scholars,
      icon: Award,
      color: 'bg-[#2d6179]',
      iconColor: 'text-[#2d6179]'
    },
    {
      title: 'Total Applications',
      value: stats.totals.applications,
      icon: FileText,
      color: 'bg-[#2bb9c5]',
      iconColor: 'text-[#2bb9c5]'
    },
    {
      title: 'Pending Applications',
      value: stats.totals.pending_applications,
      icon: Calendar,
      color: 'bg-[#2d6179]',
      iconColor: 'text-[#2d6179]'
    }
  ];

  // Prepare monthly data for charts
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthlyApplicants = months.map(month => ({
    month: month.substring(0, 3),
    applicants: parseInt(stats.monthly.applicants[month] || 0)
  }));

  const monthlyScholars = months.map(month => ({
    month: month.substring(0, 3),
    scholars: parseInt(stats.monthly.scholars[month] || 0)
  }));

  // Find the maximum value for scaling the chart
  const maxApplicants = Math.max(...monthlyApplicants.map(item => item.applicants));
  const maxScholars = Math.max(...monthlyScholars.map(item => item.scholars));
  const maxChartValue = Math.max(maxApplicants, maxScholars, 1);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your scholarship program.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2bb9c5] bg-white"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`text-white rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl ${stat.color}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.iconColor} bg-white bg-opacity-20`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Applications Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Applications & Scholars ({selectedYear})</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#2bb9c5] rounded mr-2"></div>
                  <span className="text-xs text-gray-600">Applications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#2d6179] rounded mr-2"></div>
                  <span className="text-xs text-gray-600">Scholars</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 mt-2 px-2">
              {monthlyApplicants.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="flex items-end justify-center w-full h-32 gap-1">
                    {/* Applicants bar */}
                    <div 
                      className="w-3/4 bg-[#2bb9c5] rounded-t transition-all duration-500 hover:bg-[#25a3ae] cursor-pointer"
                      style={{ height: `${(item.applicants / maxChartValue) * 100}%` }}
                      title={`${item.applicants} applications`}
                    ></div>
                    {/* Scholars bar */}
                    <div 
                      className="w-3/4 bg-[#2d6179] rounded-t transition-all duration-500 hover:bg-[#25546a] cursor-pointer"
                      style={{ height: `${(monthlyScholars[index].scholars / maxChartValue) * 100}%` }}
                      title={`${monthlyScholars[index].scholars} scholars`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">{item.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Status & Top Scholarships */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="space-y-4">
                {Object.entries(stats.applications_by_status).map(([status, count]) => {
                  const colorMap = {
                    'approved': 'bg-green-100 text-green-800',
                    'pending': 'bg-amber-100 text-amber-800',
                    'submitted': 'bg-blue-100 text-blue-800',
                    'rejected': 'bg-red-100 text-red-800',
                    'review': 'bg-purple-100 text-purple-800'
                  };
                  
                  const color = colorMap[status] || 'bg-gray-100 text-gray-800';
                  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{statusLabel}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Scholarships */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Scholarships</h3>
              <div className="space-y-4">
                {stats.top_scholarships.length > 0 ? (
                  stats.top_scholarships.map((scholarship, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 truncate">
                        <p className="font-medium text-gray-900 truncate">{scholarship.scholarship_title}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                        {scholarship.total_applications} apps
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No scholarship data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Announcements and Most Popular Course */}
        <div className="space-y-6">
          {/* Most Popular Course */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-[#2d6179]" />
              Most Popular Course
            </h3>
            <div className="flex flex-col items-center justify-center py-4">
              {stats.top_course ? (
                <>
                  <div className="text-4xl font-bold text-[#2d6179] mb-2">{stats.top_course.total_applications}</div>
                  <div className="text-sm text-gray-600 text-center">total applications for</div>
                  <div className="text-xl font-semibold mt-2 text-center text-[#2bb9c5]">{stats.top_course.course}</div>
                </>
              ) : (
                <p className="text-gray-500">No course data available</p>
              )}
            </div>
          </div>

          {/* Announcements Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Megaphone className="w-5 h-5 mr-2 text-[#2bb9c5]" />
                Announcements
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {announcementsLoading ? (
                <div className="p-5 text-center text-gray-500">Loading announcements...</div>
              ) : announcements.length > 0 ? (
                announcements.map(announcement => (
                  <div key={announcement.announcement_id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{announcement.announcement_title}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{announcement.announcement_description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>By {announcement.first_name} {announcement.last_name}</span>
                      <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-gray-500">No announcements available</div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <Link to='/admin/announcements' className="text-sm text-[#2bb9c5] hover:text-[#2d6179] font-medium flex items-center justify-center w-full">
                View all announcements <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;