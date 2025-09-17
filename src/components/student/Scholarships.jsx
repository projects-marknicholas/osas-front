import React, { useState } from 'react';
import { Award, Calendar, DollarSign, FileText, Search, Filter, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationModal from './ApplicationModal';

const Scholarships = () => {
  const { scholarships, submitApplication } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const activeScholarships = scholarships.filter(s => s.status === 'active');
  
  const filteredScholarships = activeScholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = (applicationData) => {
    const fullApplication = {
      ...applicationData,
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      studentNumber: user.studentNumber,
      scholarshipId: selectedScholarship.id,
      scholarshipTitle: selectedScholarship.title
    };
    
    submitApplication(fullApplication);
    setShowApplicationModal(false);
    setSelectedScholarship(null);
  };

  const isDeadlineSoon = (endDate) => {
    const deadline = new Date(endDate);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Scholarships</h1>
          <p className="text-gray-600 mt-1">Discover opportunities to fund your education</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScholarships.map((scholarship, index) => (
          <div
            key={scholarship.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{scholarship.title}</h3>
                  {isDeadlineSoon(scholarship.endDate) && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">Deadline Soon!</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {scholarship.amount}
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{scholarship.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Application Period: {new Date(scholarship.startDate).toLocaleDateString()} - {new Date(scholarship.endDate).toLocaleDateString()}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {scholarship.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {scholarship.courses.includes('all') ? (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Eligible Courses:</span> All Courses
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Eligible Courses:</span> {scholarship.courses.join(', ')}
                </div>
              )}
            </div>

            <button
              onClick={() => handleApply(scholarship)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
          </div>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
          <p className="text-gray-600">Try adjusting your search terms or check back later for new opportunities.</p>
        </div>
      )}

      {showApplicationModal && (
        <ApplicationModal
          scholarship={selectedScholarship}
          onSubmit={handleSubmitApplication}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedScholarship(null);
          }}
        />
      )}
    </div>
  );
};

export default Scholarships;