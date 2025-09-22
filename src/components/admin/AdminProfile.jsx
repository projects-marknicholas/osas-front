import React, { useState, useEffect } from "react";
import { Mail, Shield, Edit3, Save, X } from "lucide-react";
import {
  getProfile,
  updateProfile as updateProfileApi,
  getDepartments
} from "../../api/admin";
import Swal from "sweetalert2";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    async function fetchProfileAndDepartments() {
      try {
        const [profileRes, deptRes] = await Promise.all([
          getProfile(),
          getDepartments({ page: 1, limit: 100 }),
        ]);

        if (profileRes.success) {
          setUser(profileRes.data);
          setFormData(profileRes.data);
        }

        if (deptRes.success && Array.isArray(deptRes.data)) {
          setDepartments(deptRes.data);
        }
      } catch (err) {
        console.error("Error fetching profile or departments:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch profile or departments. Please try again.",
          confirmButtonColor: "#2d6179",
        });
      }
    }
    fetchProfileAndDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await updateProfileApi(formData);
      if (res.success) {
        setUser({ ...user, ...formData });
        setIsEditing(false);
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          confirmButtonColor: "#2bb9c5",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.error || "Failed to update profile.",
          confirmButtonColor: "#2d6179",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
        confirmButtonColor: "#2d6179",
      });
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2bb9c5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your administrator account
          </p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#2bb9c5] text-white rounded-lg hover:bg-[#249da7] transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#2d6179] text-white rounded-lg hover:bg-[#244d61] transition-all flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#2d6179] px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-[#2d6179]" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-200 mt-1">OSAS Administrator</p>
              <p className="text-gray-200">
                {
                  departments.find(
                    (dept) => dept.department_id === formData.department
                  )?.department_name || formData.department
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user?.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user?.last_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Administrative Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {
                      departments.find(
                        (dept) => dept.department_id === formData.department
                      )?.department_name || formData.department
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  Administrator
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  Full Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
