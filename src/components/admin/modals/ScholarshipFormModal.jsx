import { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";

const ScholarshipFormModal = ({
  onSubmit,
  onCancel,
  initialName = "",
  initialFile = null,
  isEditing = false,
}) => {
  const [formName, setFormName] = useState(initialName);
  const [file, setFile] = useState(initialFile);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormName(initialName);
    setFile(initialFile);
  }, [initialName, initialFile]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formName, file);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Form Name
        </label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter form name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2bb9c5] focus:border-transparent"
          required
        />
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#2bb9c5] transition"
      >
        {file ? (
          <p className="text-gray-700">{file.name}</p>
        ) : (
          <p className="text-gray-500 flex items-center justify-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Drag & Drop or Click to Upload</span>
          </p>
        )}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
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
          {isEditing ? "Update Form" : "Add Form"}
        </button>
      </div>
    </form>
  );
};

export default ScholarshipFormModal;
