import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, AlertCircle, Edit } from "lucide-react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/admin";
import Modal from "./modals/ModalParent";
import DepartmentForm from "./modals/DepartmentModal";
import ResponseModal from "./modals/ResponseModal";

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, [page, searchTerm]);

  const showResponse = (type, title, message) => {
    setResponse({ type, title, message });
  };

  const closeResponse = () => {
    setResponse(null);
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments({ page, limit, search: searchTerm });
      if (res.success) {
        setDepartments(res.data || []);
        setTotal(parseInt(res.pagination?.total_items || 0));
      } else {
        setDepartments([]);
        showResponse("error", "Error", "Failed to load departments");
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      showResponse("error", "Error", "Failed to load departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (departmentName) => {
    try {
      const res = await createDepartment({ department_name: departmentName });
      if (res.success) {
        showResponse("success", "Added!", `Department "${departmentName}" has been added.`);
        setShowAddModal(false);
        fetchDepartments();
      } else {
        throw new Error(res.error || "Failed to add department");
      }
    } catch (err) {
      showResponse("error", "Error", err.message);
    }
  };

  const handleEditDepartment = async (departmentName) => {
    try {
      const res = await updateDepartment({
        department_id: editingDepartment.department_id,
        department_name: departmentName.trim(),
      });
      if (res.success) {
        showResponse("success", "Updated!", `Department renamed to "${departmentName}"`);
        setEditingDepartment(null);
        fetchDepartments();
      } else {
        throw new Error(res.error || "Failed to update department");
      }
    } catch (err) {
      showResponse("error", "Error", err.message);
    }
  };

  const handleDeleteDepartment = async (department_id, department_name) => {
    // Using SweetAlert for confirmation dialog
    const Swal = await import('sweetalert2');
    Swal.default.fire({
      title: "Are you sure?",
      text: `This will permanently delete: ${department_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d6179",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteDepartment({ department_id });
          if (res.success) {
            showResponse("success", "Deleted!", `Department "${department_name}" has been deleted.`);
            fetchDepartments();
          } else {
            throw new Error(res.error || "Failed to delete department");
          }
        } catch (err) {
          showResponse("error", "Error", err.message);
        }
      }
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Response */}
      {response && (
        <ResponseModal
          type={response.type}
          title={response.title}
          message={response.message}
          onClose={closeResponse}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Departments</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage academic programs</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-12 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#2bb9c5] text-white rounded-r-lg hover:bg-[#249da7] transition-colors"
            >
              Search
            </button>
          </form>

          {/* Add Department Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#244d61] transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Department"
      >
        <DepartmentForm
          onSubmit={handleAddDepartment}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        title="Edit Department"
      >
        <DepartmentForm
          onSubmit={handleEditDepartment}
          onCancel={() => setEditingDepartment(null)}
          initialValue={editingDepartment?.department_name || ""}
          isEditing={true}
        />
      </Modal>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2bb9c5]"></div>
                    </div>
                  </td>
                </tr>
              ) : departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept.department_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => setEditingDepartment({...dept})}
                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteDepartment(
                            dept.department_id,
                            dept.department_name
                          )
                        }
                        className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No departments found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? `No departments match "${searchTerm}"`
                        : "No departments have been added yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDepartments;