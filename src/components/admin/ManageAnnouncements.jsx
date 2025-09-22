import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Megaphone, Search } from "lucide-react";
import {
  createAnnouncement,
  getAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
} from "../../api/admin";
import Swal from "sweetalert2";
import AnnouncementForm from "./modals/AnnouncementModal";
import Modal from "./modals/ModalParent";

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [formData, setFormData] = useState({
    announcement_title: "",
    announcement_description: "",
  });

  // Alerts
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      confirmButtonColor: "#2d6179",
      timer: 3000,
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      confirmButtonColor: "#d33",
    });
  };

  // Fetch announcements
  const fetchAnnouncements = async (page = 1, limit = 10, search = "") => {
    try {
      setLoading(true);
      const response = await getAnnouncements({ page, limit, search });

      if (response && response.success) {
        setAnnouncements(Array.isArray(response.data) ? response.data : []);

        if (response.pagination) {
          setPagination({
            page: response.pagination.current_page || 1,
            limit: response.pagination.per_page || 10,
            totalItems: parseInt(response.pagination.total_items || 0),
            totalPages: response.pagination.total_pages || 0,
          });
        }
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch announcements";
      setError(errorMessage);
      showErrorAlert(errorMessage);
      console.error("Error fetching announcements:", err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handlers
  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setFormData({ announcement_title: "", announcement_description: "" });
    setShowModal(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      announcement_title: announcement.announcement_title || "",
      announcement_description: announcement.announcement_description || "",
    });
    setShowModal(true);
  };

  const handleDeleteAnnouncement = async (announcementId, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d6179",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAnnouncement({ announcement_id: announcementId });
        showSuccessAlert("Announcement deleted successfully!");
        fetchAnnouncements(pagination.page, pagination.limit, searchTerm);
      } catch (err) {
        const errorMessage = err.message || "Failed to delete announcement";
        setError(errorMessage);
        showErrorAlert(errorMessage);
        console.error("Error deleting announcement:", err);
      }
    }
  };

  const handleSubmit = async (formValues) => {
    try {
      if (editingAnnouncement && editingAnnouncement.announcement_id) {
        await editAnnouncement({
          announcement_id: editingAnnouncement.announcement_id,
          ...formValues,
        });
        showSuccessAlert("Announcement updated successfully!");
      } else {
        await createAnnouncement(formValues);
        showSuccessAlert("Announcement created successfully!");
      }

      fetchAnnouncements(pagination.page, pagination.limit, searchTerm);
      setShowModal(false);
      setEditingAnnouncement(null);
    } catch (err) {
      const errorMessage = err.message || "Failed to save announcement";
      setError(errorMessage);
      showErrorAlert(errorMessage);
      console.error("Error submitting announcement:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnnouncements(1, pagination.limit, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAnnouncements(newPage, pagination.limit, searchTerm);
    }
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d6179]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Announcements
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage announcements for all users
          </p>
        </div>
        <button
          onClick={handleAddAnnouncement}
          className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#235067] transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Announcement</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search announcements..."
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((a) => (
          <div
            key={a.announcement_id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-[#2d6179] p-3 rounded-lg">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {a.announcement_title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    by {a.first_name} {a.last_name}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAnnouncement(a)}
                  className="p-2 text-gray-600 hover:text-[#2d6179] hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handleDeleteAnnouncement(a.announcement_id, a.announcement_title)
                  }
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm">{a.announcement_description}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-lg ${
              pagination.page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#2d6179] text-white hover:bg-[#235067]"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 py-2 rounded-lg ${
              pagination.page === pagination.totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#2d6179] text-white hover:bg-[#235067]"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Empty state */}
      {announcements.length === 0 && !loading && (
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No announcements found" : "No announcements yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first announcement to get started."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddAnnouncement}
              className="px-6 py-3 bg-[#2d6179] text-white rounded-lg hover:bg-[#235067] transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Announcement</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingAnnouncement(null);
          }}
          title={editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
          maxWidth="max-w-xl"
        >
          <AnnouncementForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowModal(false);
              setEditingAnnouncement(null);
            }}
            initialTitle={editingAnnouncement?.announcement_title || ""}
            initialDescription={editingAnnouncement?.announcement_description || ""}
            isEditing={!!editingAnnouncement}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageAnnouncements;
