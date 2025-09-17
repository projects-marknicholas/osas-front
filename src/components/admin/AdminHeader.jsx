import React from 'react';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            OSAS Administration
          </h1>
          <p className="text-gray-600 text-sm">
            Scholarship Management System
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;