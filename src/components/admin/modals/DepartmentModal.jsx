import { useState, useEffect } from "react";

const DepartmentForm = ({ 
  onSubmit, 
  onCancel, 
  initialValue = "", 
  isEditing = false 
}) => {
  const [departmentName, setDepartmentName] = useState(initialValue);

  useEffect(() => {
    setDepartmentName(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(departmentName);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department Name
        </label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
          placeholder="Enter department name..."
          autoFocus
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
          {isEditing ? "Update Department" : "Add Department"}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;