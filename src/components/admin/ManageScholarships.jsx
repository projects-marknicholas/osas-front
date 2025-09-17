import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Award, Calendar, DollarSign, Users, Search } from 'lucide-react';
import { createScholarship, getScholarships, updateScholarship, deleteScholarship } from '../../api/admin';
import Swal from 'sweetalert2';

const ManageScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Show success alert
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonColor: '#2d6179',
      timer: 3000
    });
  };

  // Show error alert
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message,
      confirmButtonColor: '#d33'
    });
  };

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
            totalItems: response.pagination.total_items || 0,
            totalPages: response.pagination.total_pages || 0
          });
        }
      } else {
        setScholarships([]);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch scholarships';
      setError(errorMessage);
      showErrorAlert(errorMessage);
      console.error('Error fetching scholarships:', err);
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleAddScholarship = () => {
    setEditingScholarship(null);
    setShowModal(true);
  };

  const handleEditScholarship = (scholarship) => {
    setEditingScholarship(scholarship);
    setShowModal(true);
  };

  const handleDeleteScholarship = async (scholarshipId, scholarshipTitle) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${scholarshipTitle}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2d6179',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteScholarship({ scholarship_id: scholarshipId });
        showSuccessAlert('Scholarship deleted successfully!');
        // Refresh the list after deletion
        fetchScholarships(pagination.page, pagination.limit, searchTerm);
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete scholarship';
        setError(errorMessage);
        showErrorAlert(errorMessage);
        console.error('Error deleting scholarship:', err);
      }
    }
  };

  const handleSubmit = async (scholarshipData) => {
    try {
      if (editingScholarship && editingScholarship.scholarship_id) {
        await updateScholarship({
          scholarship_id: editingScholarship.scholarship_id,
          ...scholarshipData
        });
        showSuccessAlert('Scholarship updated successfully!');
      } else {
        await createScholarship(scholarshipData);
        showSuccessAlert('Scholarship created successfully!');
      }
      
      // Refresh the list after creating/updating
      fetchScholarships(pagination.page, pagination.limit, searchTerm);
      setShowModal(false);
      setEditingScholarship(null);
    } catch (err) {
      const errorMessage = err.message || 'Failed to save scholarship';
      setError(errorMessage);
      showErrorAlert(errorMessage);
      console.error('Error submitting scholarship:', err);
    }
  };

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
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format amount as currency
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return 'Not specified';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date';
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Simple Scholarship Modal Component
  const ScholarshipModal = ({ scholarship, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
      scholarship_title: scholarship?.scholarship_title || '',
      description: scholarship?.description || '',
      start_date: scholarship?.start_date || '',
      end_date: scholarship?.end_date || '',
      status: scholarship?.status || 'active',
      amount: scholarship?.amount || '',
      course_codes: scholarship?.course_codes || [],
      scholarship_form_ids: scholarship?.scholarship_form_ids || []
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {scholarship ? 'Edit Scholarship' : 'Create Scholarship'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  name="scholarship_title"
                  value={formData.scholarship_title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                  >
                    <option value="active">Active</option>
                    <option value="archive">Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Codes (comma-separated)
                </label>
                <input
                  type="text"
                  name="course_codes"
                  value={formData.course_codes.join(', ')}
                  onChange={(e) => {
                    const codes = e.target.value.split(',').map(code => code.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, course_codes: codes }));
                  }}
                  placeholder="CS101, MATH202, ENG301"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scholarship Form IDs (comma-separated)
                </label>
                <input
                  type="text"
                  name="scholarship_form_ids"
                  value={formData.scholarship_form_ids.join(', ')}
                  onChange={(e) => {
                    const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean);
                    setFormData(prev => ({ ...prev, scholarship_form_ids: ids }));
                  }}
                  placeholder="1, 2, 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2d6179] text-white rounded-md hover:bg-[#235067]"
                >
                  {scholarship ? 'Update' : 'Create'} Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Scholarships</h1>
          <p className="text-gray-600 mt-1">Create and manage scholarship programs</p>
        </div>
        <button
          onClick={handleAddScholarship}
          className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#235067] transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scholarship</span>
        </button>
      </div>

      {/* Search and Filter Section */}
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditScholarship(scholarship)}
                    className="p-2 text-gray-600 hover:text-[#2d6179] hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteScholarship(scholarshipId, title)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              </div>

              {scholarshipForms.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Required Forms:</span>
                    <ul className="mt-1 space-y-1">
                      {scholarshipForms.slice(0, 2).map((formId, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          Form ID: {formId}
                        </li>
                      ))}
                      {scholarshipForms.length > 2 && (
                        <li className="text-gray-500">+{scholarshipForms.length - 2} more forms...</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
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
            {searchTerm ? 'No scholarships found' : 'No scholarships yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Create your first scholarship program to get started.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddScholarship}
              className="px-6 py-3 bg-[#2d6179] text-white rounded-lg hover:bg-[#235067] transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Scholarship</span>
            </button>
          )}
        </div>
      )}

      {showModal && (
        <ScholarshipModal
          scholarship={editingScholarship}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false);
            setEditingScholarship(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageScholarships;