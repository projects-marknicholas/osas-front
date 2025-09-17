import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Initialize with sample data
    const sampleScholarships = [
      {
        id: 1,
        title: 'Academic Excellence Scholarship',
        description: 'For students with outstanding academic performance',
        amount: '₱50,000',
        requirements: ['GPA of 3.5 or higher', 'Certificate of Good Moral Character', 'Income Certificate'],
        startDate: '2025-01-15',
        endDate: '2025-02-15',
        status: 'active',
        courses: ['all']
      },
      {
        id: 2,
        title: 'STEM Innovation Grant',
        description: 'Supporting students in Science, Technology, Engineering, and Mathematics',
        amount: '₱75,000',
        requirements: ['STEM Course Enrollment', 'Research Proposal', 'Faculty Recommendation'],
        startDate: '2025-01-20',
        endDate: '2025-02-20',
        status: 'active',
        courses: ['Computer Science', 'Engineering', 'Mathematics']
      }
    ];

    const sampleCourses = [
      'Computer Science',
      'Information Technology',
      'Engineering',
      'Business Administration',
      'Education',
      'Mathematics',
      'Nursing',
      'Agriculture'
    ];

    setScholarships(sampleScholarships);
    setCourses(sampleCourses);
  }, []);

  const addScholarship = (scholarship) => {
    const newScholarship = {
      ...scholarship,
      id: Date.now(),
      status: 'active'
    };
    setScholarships(prev => [...prev, newScholarship]);
  };

  const updateScholarship = (id, updates) => {
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addCourse = (courseName) => {
    if (!courses.includes(courseName)) {
      setCourses(prev => [...prev, courseName]);
    }
  };

  const submitApplication = (applicationData) => {
    const newApplication = {
      ...applicationData,
      id: Date.now(),
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (id, status) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
    ));
  };

  const value = {
    scholarships,
    applications,
    courses,
    students,
    addScholarship,
    updateScholarship,
    addCourse,
    submitApplication,
    updateApplicationStatus,
    setStudents
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};