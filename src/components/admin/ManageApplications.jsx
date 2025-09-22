import React, { useState, useEffect } from "react";
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";
import { getApplications, updateApplication } from "../../api/admin";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch applications
  const fetchApplications = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      const response = await getApplications({ page, search, status });

      if (response.success) {
        setApplications(response.data);

        // Calculate pagination properly
        const totalPages = response.pagination.total_pages || 1;
        const currentPage = Math.min(Math.max(1, page), totalPages);

        setPagination({
          ...response.pagination,
          current_page: currentPage,
          has_next: currentPage < totalPages,
          has_prev: currentPage > 1
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error || "Failed to fetch applications",
          confirmButtonColor: "#2d6179",
        });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch applications. Please try again.",
        confirmButtonColor: "#2d6179",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1, searchTerm, selectedStatus);
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications(1, searchTerm, selectedStatus);
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      const response = await updateApplication({ application_id: applicationId, status });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Application status updated to ${status}`,
          confirmButtonColor: "#2bb9c5",
        });

        // Refresh list
        fetchApplications(pagination.current_page, searchTerm, selectedStatus);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error || "Failed to update application status",
          confirmButtonColor: "#2d6179",
        });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update application status. Please try again.",
        confirmButtonColor: "#2d6179",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "declined":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusCounts = {
    all: pagination.total_items || 0,
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    declined: applications.filter((app) => app.status === "declined").length,
  };

  const statusOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "declined", label: "Declined" },
  ];

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2bb9c5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
          <p className="text-gray-600 mt-1">
            Review and update student scholarship applications
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent w-64"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#2bb9c5] text-white p-1 rounded-md hover:bg-[#249da7] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#2bb9c5]"
          >
            <Filter className="w-4 h-4 mr-2" />
            {statusOptions.find((opt) => opt.key === selectedStatus)?.label} (
            {statusCounts[selectedStatus]})
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {isFilterOpen && (
            <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                {statusOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedStatus(key);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedStatus === key
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    role="menuitem"
                  >
                    {label} ({statusCounts[key]})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Forms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Scholarship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.application_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.student_number || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.student_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.course || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.forms && app.forms.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {app.forms.map((form, idx) => (
                          <li key={idx}>
                            <a
                              href={form.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2bb9c5] hover:underline text-sm flex items-center"
                            >
                              📄 {form.form_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">No forms submitted</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.scholarship_title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(app.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status?.charAt(0).toUpperCase() +
                          app.status?.slice(1) || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(app.application_id, "approved")
                          }
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(app.application_id, "declined")
                          }
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && !loading && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              {selectedStatus === "all"
                ? "No applications have been submitted yet."
                : `No applications with ${selectedStatus} status.`}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.current_page - 1) * pagination.per_page + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.current_page * pagination.per_page,
                    pagination.total_items
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total_items}</span>{" "}
                results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchApplications(pagination.current_page - 1, searchTerm, selectedStatus)}
                  disabled={!pagination.has_prev}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchApplications(pagination.current_page + 1, searchTerm, selectedStatus)}
                  disabled={!pagination.has_next}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
