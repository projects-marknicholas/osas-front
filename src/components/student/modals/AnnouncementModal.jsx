import { X, Calendar, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnnouncementModal = ({ announcement, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {announcement && (
        <motion.div
          className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {announcement.announcement_title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <div className="flex items-center mr-4">
                  <UserIcon className="w-4 h-4 mr-1" />
                  <span>{announcement.first_name} {announcement.last_name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(announcement.created_at)}</span>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <p>{announcement.announcement_description}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#2bb9c5] text-white rounded-md hover:bg-[#2d6179] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
