import React, { useState } from 'react';
import { Edit3, Star, Calendar, Users } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import profileService from '../../services/profile/profile.service';
import { useAuth } from '../auth/AuthContext';

const WelcomeSection = ({ user }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const { user: authUser, setUser } = useAuth();

  // Mock stats for now
  const stats = {
    sessionsCompleted: '--',
    helpedStudents: '--',
    upcomingThisWeek: '--'
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Extract user name
  const getUserName = () => {
    if (!user) return 'Student';
    if (user.fullname?.name) {
      return user.fullname.name.split(' ')[0];
    }
    return 'Student';
  };

  // Get full name for display
  const getFullName = () => {
    if (!user) return 'Student';
    if (user.fullname?.name) {
      return user.fullname.name;
    }
    return 'Student';
  };

  // Get profile image with fallback
  const getProfileImage = () => {
    return user?.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName())}&background=6366f1&color=fff&size=64`;
  };

  const handleSaveProfile = async (formData) => {
    try {
      setIsUpdating(true);
      setUpdateError('');
      setUpdateSuccess('');

      console.log('Saving profile:', formData);

      // Get user ID from the authenticated user
      const userId = user?.id || user?.userId;

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Prepare the profile data for the API
      const profileData = {
        name: formData.name,
        major: formData.major,
        studyYear: formData.studyYear,
        bio: formData.bio
      };

      // Call the profile service to update the profile
      const response = await profileService.updateProfile(userId, profileData);

      console.log('Profile updated successfully:', response);

      setUpdateSuccess('Profile updated successfully!');
      setShowEditProfile(false);

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(''), 3000);

    } catch (error) {
      console.error('Failed to save profile:', error);
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        {/* Mobile: Stack avatar on top, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center w-full sm:w-auto mb-4 sm:mb-0">
          {/* Avatar section */}
          <div className="relative mb-4 sm:mb-0 sm:mr-4">
            <img
              src={getProfileImage()}
              alt={getFullName()}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            {user?.emailVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center" title="Email Verified">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* User info section */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {getUserName()}!
            </h1>
            <p className="text-gray-600">
              {user.fullname?.major} {`• ${user.fullname?.studyYear}`}
            </p>
            {/* <p className="text-xs text-gray-400">
              {user.fullname?.schoolName || 'African Leadership University'}
            </p> */}
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
            {user.fullname?.bio && (
              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                {user.fullname?.bio}
              </p>
            )}
          </div>
        </div>

        {/* Edit button and status */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-medium ${user.fullname?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            {user.fullname?.status || 'INACTIVE'}
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.sessionsCompleted}</div>
          <div className="text-sm text-gray-600">Sessions Completed</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
            <Star className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.helpedStudents}</div>
          <div className="text-sm text-gray-600">Students Helped</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-2">
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.upcomingThisWeek}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
            <Star className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{user.fullname?.skills?.length || 0}</div>
          <div className="text-sm text-gray-600">Modules I can Offer Help</div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{updateSuccess}</p>
        </div>
      )}

      {updateError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{updateError}</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        user={user}
        onSave={handleSaveProfile}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default WelcomeSection;
