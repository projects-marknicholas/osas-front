import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, Megaphone, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnnouncementModal } from './modals/AnnouncementModal';
import { getProfile, getAnnouncements } from '../../api/student';

const Header = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 3;

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success) setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch announcements
  const fetchAnnouncements = async (nextPage = 1) => {
    try {
      setLoadingAnnouncements(true);
      const res = await getAnnouncements(nextPage, LIMIT);
      if (res.success) {
        setAnnouncements(prev => [...prev, ...res.data]);
        setHasMore(res.data.length === LIMIT);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loadingAnnouncements) {
      setPage(prev => prev + 1);
    }
  };

  const formatYearLevel = (year) => {
    switch (year) {
      case 1: return '1st year';
      case 2: return '2nd year';
      case 3: return '3rd year';
      case 4: return '4th year';
      case 5: return '5th year';
      default: return `${year}th year`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowNotifications(false);
  };

  const closeAnnouncementModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedAnnouncement(null);
      setIsModalClosing(false);
    }, 300);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? "Loading profile..." : `Welcome back, ${profile?.first_name || ""}!`}
            </h1>
            {!loading && (
              <p className="text-gray-600 text-sm">
                {profile?.course} • {formatYearLevel(profile?.year_level)}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 text-gray-600 hover:text-[#2d6179] hover:bg-[#2bb9c5]/10 rounded-lg transition-all duration-200"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Megaphone className="w-4 h-4 mr-2 text-[#2bb9c5]" />
                        Announcements
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {loadingAnnouncements && announcements.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Loading announcements...</div>
                    ) : announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <div
                          key={announcement.announcement_id}
                          className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleAnnouncementClick(announcement)}
                        >
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {announcement.announcement_title}
                          </h4>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {announcement.announcement_description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>By {announcement.first_name} {announcement.last_name}</span>
                            <span>{formatDate(announcement.created_at)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No announcements available
                      </div>
                    )}
                  </div>

                  {hasMore && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={loadMore}
                        className="w-full text-sm text-[#2bb9c5] hover:text-[#2d6179] font-medium"
                        disabled={loadingAnnouncements}
                      >
                        {loadingAnnouncements ? "Loading..." : "View more"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#2bb9c5] to-[#2d6179] rounded-full flex items-center justify-center">
                {profile?.picture ? (
                  <img
                    src={profile.picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {profile?.first_name} {profile?.last_name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overlay */}
        {showNotifications && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
        )}
      </header>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <AnnouncementModal 
          announcement={selectedAnnouncement} 
          onClose={closeAnnouncementModal}
        />
      )}
    </>
  );
};

export default Header;
