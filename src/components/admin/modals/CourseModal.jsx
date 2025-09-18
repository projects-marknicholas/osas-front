import { useState, useEffect } from "react";

const CourseForm = ({ 
  onSubmit, 
  onCancel, 
  initialCode = "", 
  initialName = "", 
  isEditing = false 
}) => {
  const [courseCode, setCourseCode] = useState(initialCode);
  const [courseName, setCourseName] = useState(initialName);

  useEffect(() => {
    setCourseCode(initialCode);
    setCourseName(initialName);
  }, [initialCode, initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ course_code: courseCode, course_name: courseName });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Code
        </label>
        <input
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
          placeholder="Enter course code..."
          disabled={isEditing} // para hindi editable pag edit mode
          autoFocus
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Name
        </label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
          placeholder="Enter course name..."
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#2bb9c5] text-white rounded-lg hover:bg-[#249da7] transition-colors"
        >
          {isEditing ? "Update Course" : "Add Course"}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
