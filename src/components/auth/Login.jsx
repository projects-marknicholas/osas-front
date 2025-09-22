import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { studentLogin } from '../../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    studentNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await studentLogin(formData); 

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        id: data.user.id,
        user_id: data.user.user_id,
        api_key: data.user.api_key,
        csrf_token: data.user.csrf_token,
        role: 'student',
      };

      login(userData); 
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error) {
      // SweetAlert2 error
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid student number or password',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-[#2bb9c5] to-[#2d6179] p-4 rounded-full shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your LSPU scholarship account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your student number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2bb9c5] to-[#2d6179] text-white py-3 px-4 rounded-lg font-medium hover:from-[#25a5b0] hover:to-[#25546a] focus:outline-none focus:ring-2 focus:ring-[#2bb9c5] focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#2d6179] hover:text-[#25546a] font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;