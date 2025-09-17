import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import AdminAccounts from './AdminAccounts';
import ManageScholarships from './ManageScholarships';
import ManageScholarshipForms from './ManageScholarshipForms';
import ManageCourses from './ManageCourses';
import ManageDepartments from './ManageDepartments';
import ManageApplications from './ManageApplications';
import AdminProfile from './AdminProfile';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/accounts" element={<AdminAccounts />} />
            <Route path="/scholarships" element={<ManageScholarships />} />
            <Route path="/forms" element={<ManageScholarshipForms />} />
            <Route path="/courses" element={<ManageCourses />} />
            <Route path="/departments" element={<ManageDepartments />} />
            <Route path="/applications" element={<ManageApplications />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;