import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

const ApplicationModal = ({ scholarship, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    essay: '',
    gpa: '',
    familyIncome: '',
    additionalInfo: ''
  });
  const [documents, setDocuments] = useState({
    indigencyCert: null,
    goodMoralCert: null,
    photo: null,
    schoolId: null,
    corCert: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    setDocuments({
      ...documents,
      [docType]: file
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      documents,
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apply for Scholarship</h2>
              <p className="text-gray-600 text-sm">{scholarship.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Statement / Essay *
            </label>
            <textarea
              name="essay"
              value={formData.essay}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explain why you deserve this scholarship and how it will help you achieve your goals..."
              required
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
            
            {[
              { key: 'indigencyCert', label: 'Certificate of Indigency', required: true },
              { key: 'goodMoralCert', label: 'Certificate of Good Moral', required: false },
              { key: 'photo', label: '2x2 Picture', required: true },
              { key: 'schoolId', label: 'School ID', required: true },
              { key: 'corCert', label: 'Certificate of Registration (COR)', required: true }
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && '*'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  {documents[key] ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{documents[key].name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDocuments({ ...documents, [key]: null })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Click to upload {label.toLowerCase()}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, key)}
                        required={required}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;