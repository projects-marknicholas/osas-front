import { useState, useEffect } from "react";

const AnnouncementForm = ({ 
  onSubmit, 
  onCancel, 
  initialTitle = "", 
  initialDescription = "", 
  isEditing = false 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      announcement_title: title,
      announcement_description: description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Announcement Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
          placeholder="Enter announcement title..."
          autoFocus
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
          placeholder="Enter announcement description..."
          rows="5"
          required
        />
      </div>

      {/* Actions */}
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
          {isEditing ? "Update Announcement" : "Add Announcement"}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
