import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Profile from './Profile';
import Scholarships from './Scholarships';
import Applications from './Applications';

const StudentDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Scholarships />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;