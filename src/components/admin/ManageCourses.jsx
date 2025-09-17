import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, AlertCircle, Edit } from "lucide-react";
import Swal from "sweetalert2";
import {
  getCourses,
  createCourse,
  editCourse,
  deleteCourse,
} from "../../api/admin";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, [page, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCourses({ page, limit, search: searchTerm });
      if (res.success) {
        setCourses(res.data || []);
        setTotal(res.total || 0);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load courses. Please try again.",
        confirmButtonColor: "#2d6179",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseName.trim()) return;

    try {
      const res = await createCourse({
        course_code: newCourseCode.trim(),
        course_name: newCourseName.trim(),
      });
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Course "${newCourseCode} - ${newCourseName}" has been added.`,
          confirmButtonColor: "#2bb9c5",
        });
        setNewCourseCode("");
        setNewCourseName("");
        setShowAddForm(false);
        fetchCourses();
      } else {
        throw new Error(res.error || "Failed to add course");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#2d6179",
      });
    }
  };

  const handleDeleteCourse = async (course_code, course_name) => {
    Swal.fire({
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
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: `Course "${course_code} - ${course_name}" has been deleted.`,
              confirmButtonColor: "#2bb9c5",
            });
            fetchCourses();
          } else {
            throw new Error(res.error || "Failed to delete course");
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message,
            confirmButtonColor: "#2d6179",
          });
        }
      }
    });
  };

  const handleEditCourse = async (course) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Course",
      html: `
        <input id="swal-course-code" class="swal2-input" placeholder="Course Code" value="${course.course_code}" disabled>
        <input id="swal-course-name" class="swal2-input" placeholder="Course Name" value="${course.course_name}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#2bb9c5",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const code = document.getElementById("swal-course-code").value;
        const name = document.getElementById("swal-course-name").value;
        if (!name.trim()) {
          Swal.showValidationMessage("Course name cannot be empty");
        }
        return { course_code: code, course_name: name };
      },
    });

    if (formValues && formValues.course_name !== course.course_name) {
      try {
        const res = await editCourse(formValues);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: `Course updated to "${formValues.course_code} - ${formValues.course_name}"`,
            confirmButtonColor: "#2bb9c5",
          });
          fetchCourses();
        } else {
          throw new Error(res.error || "Failed to update course");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          confirmButtonColor: "#2d6179",
        });
      }
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-1">
            Add, edit, and manage academic courses
          </p>
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
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#244d61] transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Course
          </h3>
          <form onSubmit={handleAddCourse} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
              placeholder="Enter course code..."
              required
            />
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
              placeholder="Enter course name..."
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#2bb9c5] text-white rounded-lg hover:bg-[#249da7] transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewCourseCode("");
                setNewCourseName("");
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
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
                        onClick={() => handleEditCourse(course)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCourse(course.course_code, course.course_name)
                        }
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No courses found
                    </h3>
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
