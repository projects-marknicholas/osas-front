import React, { useState } from "react";
import { X, FileText, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { applyScholarship } from "../../../api/student";
import Swal from "sweetalert2";

const ScholarshipApplyModal = ({ scholarship, onClose }) => {
  const scholarshipForms = Array.isArray(scholarship.scholarship_forms)
    ? scholarship.scholarship_forms
    : [];

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, formName) => {
    setFiles({
      ...files,
      [formName]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ⬇️ dito lang dagdag para makuha yung scholarship_id
      const res = await applyScholarship(scholarship.scholarship_id, files);

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: res.message || "Your scholarship application has been submitted!",
      });
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: err.message || "Something went wrong while applying.",
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Apply for{" "}
            <span className="text-[#235067]">
              {scholarship.scholarship_title}
            </span>
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {scholarshipForms.length > 0 ? (
              scholarshipForms.map((form) => (
                <div
                  key={form.scholarship_form_id}
                  className="flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                >
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-[#235067] mr-2" />
                    {form.scholarship_form_name}
                  </label>

                  {/* Download link */}
                  <a
                    href={form.url || form.scholarship_form}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#2bb9c5] hover:underline text-sm mb-2"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download {form.scholarship_form_name}
                  </a>

                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e, form.scholarship_form_name)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm 
                               file:mr-3 file:py-2 file:px-4 file:rounded-md 
                               file:border-0 file:text-sm file:font-medium 
                               file:bg-[#235067] file:text-white hover:file:bg-[#1c4154] cursor-pointer"
                    required
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">
                No forms required for this scholarship.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#235067] hover:bg-[#1c4154] text-white"
              }`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScholarshipApplyModal;
