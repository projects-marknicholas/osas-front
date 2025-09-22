import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, AlertCircle, Edit } from "lucide-react";
import Swal from "sweetalert2";
import {
  getScholarshipForms,
  createScholarshipForm,
  editScholarshipForm,
  deleteScholarshipForm,
} from "../../api/admin";
import Modal from "./modals/ModalParent";
import ScholarshipFormModal from "./modals/ScholarshipFormModal";

const ManageScholarshipForms = () => {
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchForms();
  }, [page, searchTerm]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await getScholarshipForms({ page, limit, search: searchTerm });
      if (res.success) {
        setForms(res.data || []);
        setTotal(parseInt(res.pagination?.total_items || 0));
      } else {
        setForms([]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load scholarship forms.",
        confirmButtonColor: "#2d6179",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddForm = async (name, file) => {
    if (!name.trim() || !file) return;
    try {
      const res = await createScholarshipForm({ scholarship_form_name: name, file });
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Scholarship Form "${name}" has been added.`,
          confirmButtonColor: "#2bb9c5",
        });
        setShowAddModal(false);
        fetchForms();
      } else {
        throw new Error(res.error || "Failed to add form");
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#2d6179" });
    }
  };

  const handleEditForm = async (form_id, name, file) => {
    try {
      const res = await editScholarshipForm({ scholarship_form_id: form_id, scholarship_form_name: name, file });
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Scholarship Form has been updated.",
          confirmButtonColor: "#2bb9c5",
        });
        setEditingForm(null);
        fetchForms();
      } else {
        throw new Error(res.error || "Failed to update form");
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#2d6179" });
    }
  };

  const handleDeleteForm = async (form_id, form_name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete: ${form_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d6179",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteScholarshipForm({ scholarship_form_id: form_id });
          if (res.success) {
            Swal.fire({ icon: "success", title: "Deleted!", text: `"${form_name}" deleted.`, confirmButtonColor: "#2bb9c5" });
            fetchForms();
          } else {
            throw new Error(res.error || "Failed to delete form");
          }
        } catch (err) {
          Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#2d6179" });
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Scholarship Forms</h1>
          <p className="text-gray-600 mt-1">Upload, edit, and manage scholarship form templates</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search forms..."
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

          {/* Add Form Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#244d61] transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Form</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal || !!editingForm} onClose={() => { setShowAddModal(false); setEditingForm(null); }} title={editingForm ? "Edit Scholarship Form" : "Add New Form"}>
        <ScholarshipFormModal
          onSubmit={(name, file) => {
            if (editingForm) handleEditForm(editingForm.scholarship_form_id, name, file);
            else handleAddForm(name, file);
          }}
          onCancel={() => { setShowAddModal(false); setEditingForm(null); }}
          initialName={editingForm?.scholarship_form_name || ""}
          initialFile={null}
          isEditing={!!editingForm}
        />
      </Modal>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : forms.length > 0 ? (
                forms.map((form) => (
                  <tr key={form.scholarship_form_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{form.scholarship_form_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <a href={`${import.meta.env.VITE_FOLDER_URL}/scholarship_forms/${form.scholarship_form}`} target="_blank" rel="noopener noreferrer" className="text-[#2d6179] hover:underline">View File</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button onClick={() => setEditingForm(form)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-200 flex items-center">
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDeleteForm(form.scholarship_form_id, form.scholarship_form_name)} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 flex items-center">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
                    <p className="text-gray-600">{searchTerm ? `No forms match "${searchTerm}"` : "No forms have been uploaded yet."}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50">Previous</button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageScholarshipForms;
