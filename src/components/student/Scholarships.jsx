import React, { useState, useEffect } from 'react';
import { Award, Calendar, DollarSign, Users, Search } from 'lucide-react';
import { getScholarships } from '../../api/student';
import ScholarshipApplyModal from './modals/ApplyModal';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Fetch scholarships
  const fetchScholarships = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await getScholarships({ page, limit, search });

      if (response && response.success) {
        setScholarships(Array.isArray(response.data) ? response.data : []);
        if (response.pagination) {
          setPagination({
            page: response.pagination.current_page || 1,
            limit: response.pagination.per_page || 10,
            totalItems: parseInt(response.pagination.total_items || 0),
            totalPages: response.pagination.total_pages || 0
          });
        }
      } else {
        setScholarships([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch scholarships');
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchScholarships(1, pagination.limit, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchScholarships(newPage, pagination.limit, searchTerm);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archive':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading && scholarships.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d6179]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
        <p className="text-gray-600 mt-1">Browse available scholarship programs</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search scholarships by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2bb9c5] text-white rounded-lg hover:bg-[#25a5b0] transition-colors duration-200 flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 right-0 p-3">
            <span className="text-red-700">×</span>
          </button>
        </div>
      )}

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => {
          if (!scholarship) return null;

          const scholarshipId = scholarship.scholarship_id || 'unknown';
          const title = scholarship.scholarship_title || 'Untitled Scholarship';
          const description = scholarship.description || 'No description available';
          const status = scholarship.status || 'unknown';
          const amount = scholarship.amount;
          const startDate = scholarship.start_date;
          const endDate = scholarship.end_date;
          const courseCodes = Array.isArray(scholarship.course_codes) ? scholarship.course_codes : [];
          const scholarshipForms = Array.isArray(scholarship.scholarship_forms) ? scholarship.scholarship_forms : [];

          return (
            <div
              key={scholarshipId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#2d6179] p-3 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {formatStatusText(status)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Amount</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatAmount(amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Application Period</span>
                  </div>
                  <span className="text-gray-900">
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Eligible Courses</span>
                  </div>
                  <span className="text-gray-900">
                    {courseCodes.length > 0 
                      ? `${courseCodes.length} courses` 
                      : 'All courses'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Scholarship Forms</span>
                  </div>
                  <span className="text-gray-900">
                    {scholarshipForms.length > 0 
                      ? `${scholarshipForms.length} forms` 
                      : 'All forms'}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedScholarship(scholarship)}
                  className="mt-4 w-full px-4 py-2 bg-[#235067] text-white rounded-lg hover:bg-[#235067] transition-colors duration-200 cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-lg ${pagination.page === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-[#2d6179] text-white hover:bg-[#235067]'}`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 py-2 rounded-lg ${pagination.page === pagination.totalPages 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-[#2d6179] text-white hover:bg-[#235067]'}`}
          >
            Next
          </button>
        </div>
      )}

      {scholarships.length === 0 && !loading && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No scholarships found' : 'No scholarships available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'There are currently no scholarships open for application.'}
          </p>
        </div>
      )}

      {selectedScholarship && (
        <ScholarshipApplyModal 
          scholarship={selectedScholarship} 
          onClose={() => setSelectedScholarship(null)} 
        />
      )}
    </div>
  );
};

export default Scholarships;
