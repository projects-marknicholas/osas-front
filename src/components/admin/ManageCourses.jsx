import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, AlertCircle, Edit } from "lucide-react";
import {
  getCourses,
  createCourse,
  editCourse,
  deleteCourse,
} from "../../api/admin";
import Modal from "./modals/ModalParent";
import CourseForm from "./modals/CourseModal";
import ResponseModal from "./modals/ResponseModal";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // response modal state
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [page, searchTerm]);

  const showResponse = (type, title, message) => {
    setResponse({ type, title, message });
  };

  const closeResponse = () => {
    setResponse(null);
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCourses({ page, limit, search: searchTerm });
      if (res.success) {
        setCourses(res.data || []);
        setTotal(parseInt(res.pagination?.total_items || 0));
      } else {
        setCourses([]);
        showResponse("error", "Error", res.error || "Failed to load courses");
      }
    } catch (err) {
      showResponse("error", "Error", "Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (courseData) => {
    try {
      const res = await createCourse(courseData);
      if (res.success) {
        showResponse(
          "success",
          "Added!",
          `Course "${courseData.course_code} - ${courseData.course_name}" has been added.`
        );
        setShowAddModal(false);
        fetchCourses();
      } else {
        throw new Error(res.error || "Failed to add course");
      }
    } catch (err) {
      showResponse("error", "Error", err.message);
    }
  };

  const handleEditCourse = async (courseData) => {
    try {
      const res = await editCourse(courseData);
      if (res.success) {
        showResponse(
          "success",
          "Updated!",
          `Course updated to "${courseData.course_code} - ${courseData.course_name}"`
        );
        setEditingCourse(null);
        fetchCourses();
      } else {
        throw new Error(res.error || "Failed to update course");
      }
    } catch (err) {
      showResponse("error", "Error", err.message);
    }
  };

  const handleDeleteCourse = async (course_code, course_name) => {
    const Swal = await import("sweetalert2");
    Swal.default.fire({
      title: "Are you sure?",
      text: `This will permanently delete: ${course_code} - ${course_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2d6179",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteCourse({ course_code });
          if (res.success) {
            showResponse(
              "success",
              "Deleted!",
              `Course "${course_code} - ${course_name}" has been deleted.`
            );
            fetchCourses();
          } else {
            throw new Error(res.error || "Failed to delete course");
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
      {/* Response Modal */}
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage academic courses</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
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

          {/* Add Course Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#244d61] transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Course"
      >
        <CourseForm
          onSubmit={handleAddCourse}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        title="Edit Course"
      >
        <CourseForm
          onSubmit={handleEditCourse}
          onCancel={() => setEditingCourse(null)}
          initialCode={editingCourse?.course_code || ""}
          initialName={editingCourse?.course_name || ""}
          isEditing={true}
        />
      </Modal>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.course_code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.course_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.course_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.course_code, course.course_name)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? `No courses match "${searchTerm}"`
                        : "No courses have been added yet."}
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
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
