import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { adminLogin } from '../../api/auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const googleToken = credentialResponse.credential;
      const result = await adminLogin(googleToken);

      if (result.success) {
        login(result.user);
        MySwal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back, Admin!",
          confirmButtonColor: "#2bb9c5",
          background: "#ffffff",
          color: "#2d6179",
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Login Failed",
          text: result.error || "Authentication failed",
          confirmButtonColor: "#2d6179",
          background: "#ffffff",
          color: "#2d6179",
        });
      }
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Google login failed",
        confirmButtonColor: "#2d6179",
        background: "#ffffff",
        color: "#2d6179",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    MySwal.fire({
      icon: "warning",
      title: "Authentication Failed",
      text: "Google authentication failed. Try again.",
      confirmButtonColor: "#2bb9c5",
      background: "#ffffff",
      color: "#2d6179",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-[#2d6179] to-[#2bb9c5] p-4 rounded-full shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-gray-600">OSAS Administrator Access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <GraduationCap className="w-16 h-16 text-[#2bb9c5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Laguna State Polytechnic University
              </h3>
              <p className="text-gray-600 text-sm">
                Office of Student Affairs and Services
              </p>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                theme="filled_blue"
                shape="pill"
                size="large"
                text="signin_with"
                width="300"
              />
            </div>

            {loading && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d6179] mr-2"></div>
                  Verifying with server...
                </div>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              <p>Authorized personnel only</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-[#2d6179] hover:text-[#2bb9c5] transition-colors font-medium"
            >
              ← Back to Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;