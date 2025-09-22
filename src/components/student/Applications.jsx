import React, { useState, useEffect } from 'react';
import { Calendar, User, AlertCircle, Filter, ChevronDown, Users, Award } from 'lucide-react';
import Swal from 'sweetalert2';
import { getApplications } from '../../api/student';
import { useAuth } from '../../contexts/AuthContext';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });

  const statusOptions = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getApplications(page, pagination.per_page);
      if (response.success) {
        setApplications(response.data);
        setPagination(response.pagination);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.error || 'Failed to fetch applications',
          confirmButtonColor: '#2d6179',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch applications. Please try again.',
        confirmButtonColor: '#2d6179',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, []);

  const filteredApplications = applications.filter(app => app.status === selectedStatus);

  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#2d6179] text-white';
      case 'approved': return 'bg-green-600 text-white';
      case 'rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track the status of your scholarship applications</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full md:w-64">
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
        >
          <Filter className="w-4 h-4 mr-2" />
          {statusOptions.find(opt => opt.key === selectedStatus)?.label} ({statusCounts[selectedStatus]})
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>

        {isFilterOpen && (
          <div className="origin-top-right absolute mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {statusOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedStatus(key);
                    setIsFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    selectedStatus === key
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {label} ({statusCounts[key]})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2bb9c5]"></div>
          </div>
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div
              key={app.application_id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#2d6179] p-3 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{app.scholarship_title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{app.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Applied on</span>
                  <span className="text-gray-900 ml-auto">
                    {new Date(app.applied_at).toLocaleDateString('en-PH')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Applicant</span>
                  <span className="text-gray-900 ml-auto">
                    {app.first_name} {app.middle_name} {app.last_name} ({app.course})
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Amount</span>
                  <span className="font-semibold text-green-600 ml-auto">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(app.amount)}
                  </span>
                </div>

                <div className="flex items-start justify-between text-gray-600">
                  <Users className="w-4 h-4 mr-2 mt-1" />
                  <div className="flex-1">
                    <span className="block mb-1">Scholarship Forms</span>
                    {app.forms && app.forms.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {app.forms.map((form) => (
                          <li key={form.application_form_id}>
                            {form.form_name}{' '}
                            <span className="text-gray-500 text-xs">
                              ({new Date(form.uploaded_at).toLocaleDateString()})
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No forms submitted</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedStatus} applications</h3>
            <p className="text-gray-600">
              You don't have any applications with {selectedStatus} status.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => fetchApplications(pagination.current_page - 1)}
            disabled={!pagination.has_prev}
            className={`px-4 py-2 rounded-lg ${
              !pagination.has_prev
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#2d6179] text-white hover:bg-[#235067]'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => fetchApplications(pagination.current_page + 1)}
            disabled={!pagination.has_next}
            className={`px-4 py-2 rounded-lg ${
              !pagination.has_next
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#2d6179] text-white hover:bg-[#235067]'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Applications;
