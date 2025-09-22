import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Edit3, Save, X, Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import { getProfile as fetchProfile, updateProfile as sendProfileUpdate } from '../../api/student';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Helper to format year levels
  const formatYearLevel = (level) => {
    switch (level) {
      case '1': return '1st Year';
      case '2': return '2nd Year';
      case '3': return '3rd Year';
      case '4': return '4th Year';
      case '5': return '5th Year';
      default: return level;
    }
  };

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchProfile();
        setUser({
          firstName: res.data.first_name,
          middleName: res.data.middle_name,
          lastName: res.data.last_name,
          studentNumber: res.data.student_number,
          email: res.data.email,
          phoneNumber: res.data.phone_number,
          course: res.data.course,
          yearLevel: res.data.year_level,
          address: res.data.complete_address,
          profilePicture: res.data.picture
        });
        setFormData({
          firstName: res.data.first_name,
          middleName: res.data.middle_name,
          lastName: res.data.last_name,
          phoneNumber: res.data.phone_number,
          course: res.data.course,
          address: res.data.complete_address
        });
      } catch (err) {
        console.error('Failed to load profile', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile'
        });
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await sendProfileUpdate({
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        complete_address: formData.address
      });
      setUser({ ...user, ...formData });
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully'
      });
    } catch (err) {
      console.error('Failed to update profile', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      middleName: user?.middleName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      course: user?.course || '',
      address: user?.address || ''
    });
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
      {/* Header and Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-[#2d6179] to-[#2bb9c5] text-white rounded-lg hover:from-[#2b5b70] hover:to-[#29aac0] transition-all duration-200 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gradient-to-r from-[#2d6179] to-[#2bb9c5] text-white rounded-lg hover:from-[#2b5b70] hover:to-[#29aac0] transition-all duration-200 flex items-center space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d6179] to-[#2bb9c5] px-6 py-8 flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-[#2d6179] text-white p-2 rounded-full hover:bg-[#2b5b70] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{user.firstName} {user.middleName} {user.lastName}</h2>
            <p className="text-blue-100 mt-1">Student ID: {user.studentNumber}</p>
            <p className="text-blue-100">{user.course} • {formatYearLevel(user.yearLevel)}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            {[
              { key: 'firstName', label: 'First Name' },
              { key: 'middleName', label: 'Middle Name' },
              { key: 'lastName', label: 'Last Name' },
              { key: 'phoneNumber', label: 'Phone Number' }
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <input
                  type="text"
                  name={field.key}
                  value={formData[field.key]}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                    isEditing ? 'focus:ring-2 focus:ring-[#2d6179] focus:border-transparent' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
              <input
                type="text"
                value={formatYearLevel(user.yearLevel)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                readOnly={!isEditing}
                rows="3"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:ring-2 focus:ring-[#2d6179] focus:border-transparent' : 'bg-gray-100 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
