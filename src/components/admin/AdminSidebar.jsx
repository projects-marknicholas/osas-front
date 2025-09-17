import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Award, ClipboardList, BookOpen, Building, Users, User } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Applications', href: '/admin/applications', icon: FileText },
    { name: 'Scholarships', href: '/admin/scholarships', icon: Award },
    { name: 'Scholarship Forms', href: '/admin/forms', icon: ClipboardList },
    { name: 'Course', href: '/admin/courses', icon: BookOpen },
    { name: 'Department', href: '/admin/departments', icon: Building },
    { name: 'Accounts', href: '/admin/accounts', icon: Users },
    { name: 'Profile', href: '/admin/profile', icon: User },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-[#2d6179] to-[#2bb9c5] p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2d6179]">OSAS Admin</h1>
            <p className="text-xs text-[#2bb9c5]">Management Portal</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 px-4 flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href === '/admin' && location.pathname === '/admin/');
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2d6179] to-[#2bb9c5] text-white shadow-md'
                      : 'text-gray-700 hover:bg-[#f0f9fa] hover:text-[#2d6179]'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with user info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-[#e6f7f9] p-2 rounded-full">
            <User className="w-5 h-5 text-[#2bb9c5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#2d6179] truncate">Admin User</p>
            <p className="text-xs text-[#2bb9c5] truncate">admin@lspu.edu.ph</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;