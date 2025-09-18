import { useState, useEffect } from "react";
import { getCourses, getScholarshipForms } from "../../../api/admin";

const ScholarshipForm = ({ onSubmit, onCancel, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    scholarship_title: initialData.scholarship_title || '',
    description: initialData.description || '',
    start_date: initialData.start_date || '',
    end_date: initialData.end_date || '',
    status: initialData.status || 'active',
    amount: initialData.amount || '',
    course_codes: initialData.course_codes || [],
    scholarship_form_ids: initialData.scholarship_form_ids || []
  });

  const [courses, setCourses] = useState([]);
  const [forms, setForms] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedForm, setSelectedForm] = useState('');

  useEffect(() => {
    setFormData({
      scholarship_title: initialData.scholarship_title || '',
      description: initialData.description || '',
      start_date: initialData.start_date || '',
      end_date: initialData.end_date || '',
      status: initialData.status || 'active',
      amount: initialData.amount || '',
      course_codes: initialData.course_codes || [],
      scholarship_form_ids: initialData.scholarship_form_ids || []
    });

    const fetchDropdowns = async () => {
      try {
        const coursesRes = await getCourses({ page: 1, limit: 100 });
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);

        const formsRes = await getScholarshipForms({ page: 1, limit: 100 });
        setForms(Array.isArray(formsRes.data) ? formsRes.data : []);
      } catch (err) {
        console.error("Error fetching courses/forms:", err);
      }
    };

    fetchDropdowns();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    if (selectedCourse === 'all') {
      // Add all courses
      const allCourseCodes = courses.filter(c => c.course_code).map(c => c.course_code);
      setFormData(prev => ({ 
        ...prev, 
        course_codes: [...new Set([...prev.course_codes, ...allCourseCodes])] 
      }));
    } else if (selectedCourse && !formData.course_codes.includes(selectedCourse)) {
      // Add single course
      setFormData(prev => ({ ...prev, course_codes: [...prev.course_codes, selectedCourse] }));
    }
    setSelectedCourse('');
  };

  const handleAddForm = () => {
    if (selectedForm && !formData.scholarship_form_ids.includes(selectedForm)) {
      setFormData(prev => ({ ...prev, scholarship_form_ids: [...prev.scholarship_form_ids, selectedForm] }));
      setSelectedForm('');
    }
  };

  const handleRemoveCourse = (code) => {
    setFormData(prev => ({
      ...prev,
      course_codes: prev.course_codes.filter(c => c !== code)
    }));
  };

  const handleRemoveForm = (id) => {
    setFormData(prev => ({
      ...prev,
      scholarship_form_ids: prev.scholarship_form_ids.filter(f => f !== id)
    }));
  };

  const handleClearAllCourses = () => {
    setFormData(prev => ({
      ...prev,
      course_codes: []
    }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
      
      {/* Scholarship Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Title *</label>
        <input
          type="text"
          name="scholarship_title"
          value={formData.scholarship_title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
          >
            <option value="active">Active</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
          />
        </div>
      </div>

      {/* Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Courses</label>
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
          >
            <option value="">Select course</option>
            <option value="all">All Courses</option>
            {courses.filter(c => c.course_code).map(c => (
              <option key={`course-${c.course_code}`} value={c.course_code}>
                {c.course_code} - {c.course_name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddCourse}
            className="px-3 py-2 bg-[#2d6179] text-white rounded-md whitespace-nowrap"
          >
            Add
          </button>
          {formData.course_codes.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllCourses}
              className="px-3 py-2 bg-gray-500 text-white rounded-md whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.course_codes.map(code => {
            const course = courses.find(c => c.course_code === code);
            return (
              <span key={`added-course-${code}`} className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1">
                {course ? `${course.course_code} - ${course.course_name}` : code}
                <button type="button" onClick={() => handleRemoveCourse(code)} className="text-red-500 font-bold">×</button>
              </span>
            );
          })}
        </div>
        {formData.course_codes.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {formData.course_codes.length} course{formData.course_codes.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Forms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Required Forms</label>
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2bb9c5]"
          >
            <option value="">Select form</option>
            {forms.filter(f => f.scholarship_form_id).map(f => (
              <option key={`form-${f.scholarship_form_id}`} value={f.scholarship_form_id}>
                {f.scholarship_form_name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddForm}
            className="px-3 py-2 bg-[#2d6179] text-white rounded-md whitespace-nowrap"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.scholarship_form_ids.map(id => {
            const form = forms.find(f => f.scholarship_form_id === id);
            return (
              <span key={`added-form-${id}`} className="bg-gray-200 px-2 py-1 rounded-md flex items-center gap-1">
                {form?.scholarship_form_name || id}
                <button type="button" onClick={() => handleRemoveForm(id)} className="text-red-500 font-bold">×</button>
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-[#2d6179] text-white rounded-md hover:bg-[#235067]">
          {isEditing ? 'Update Scholarship' : 'Create Scholarship'}
        </button>
      </div>
    </form>
  );
};

export default ScholarshipForm;