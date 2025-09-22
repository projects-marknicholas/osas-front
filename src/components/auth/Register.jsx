import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    studentNumber: '',
    email: '',
    phoneNumber: '',
    yearLevel: '',
    address: '',
    course: '',
    password: '',
    confirmPassword: ''
  });
  const [files, setFiles] = useState({
    picture: null,
    schoolId: null,
    indigency: null,
    cor: null
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
  const courses = [
    'Computer Science',
    'Information Technology',
    'Engineering',
    'Business Administration',
    'Education',
    'Mathematics',
    'Nursing',
    'Agriculture'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFiles({
      ...files,
      [fileType]: file
    });
  };

  const removeFile = (fileType) => {
    setFiles({
      ...files,
      [fileType]: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        ...formData,
        role: 'student',
        profilePicture: files.picture ? URL.createObjectURL(files.picture) : null
      };
      login(userData);
      setLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name
          </label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Number *
          </label>
          <input
            type="text"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            placeholder="e.g., 2021-12345"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
          placeholder="09XX-XXX-XXXX"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Level *
          </label>
          <select
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            required
          >
            <option value="">Select Year Level</option>
            {yearLevels.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complete Address *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
          placeholder="House No., Street, Barangay, City, Province"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Required Documents</h3>
        <p className="text-gray-600 text-sm">Please upload clear, readable copies of the following documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'picture', label: '2x2 Picture', required: true },
          { key: 'schoolId', label: 'Valid School ID', required: true },
          { key: 'indigency', label: 'Certificate of Indigency', required: true },
          { key: 'cor', label: 'Certificate of Registration (COR)', required: true }
        ].map(({ key, label, required }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {required && '*'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2bb9c5] transition-colors">
              {files[key] ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{files[key].name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(key)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Click to upload</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, key)}
                    required={required}
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-[#2bb9c5] to-[#2d6179] p-4 rounded-full shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join the LSPU scholarship program</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? 'bg-[#2d6179] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? 'bg-[#2d6179]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Previous
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-[#2bb9c5] to-[#2d6179] text-white rounded-lg font-medium hover:from-[#25a5b0] hover:to-[#25546a] focus:outline-none focus:ring-2 focus:ring-[#2bb9c5] focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : currentStep === 3 ? (
                  'Create Account'
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#2d6179] hover:text-[#25546a] font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;