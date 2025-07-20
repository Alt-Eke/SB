import React, { useState } from 'react';
import { Edit3, User, BookOpen, Calendar, Mail, Phone, X, Check } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, user, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: user.fullname?.name || '',
    major: user.fullname?.major || '',
    studyYear: user.fullname?.studyYear || '',
    bio: user.fullname?.bio || '',
    role: 'Student (Buddy/Learner)'
  });

  const getFullName = () => {
    return user?.fullname?.name || 'Student';
  };

  const getProfileImage = () => {
    return user?.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName())}&background=6366f1&color=fff&size=64`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4"> <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

    ```
    <div className="relative bg-white rounded-md shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-600 bg-white rounded-full shadow-lg"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 md:p-8 flex flex-col justify-center md:w-1/2">
        <div className="mb-6">
          <div className="flex items-center mb-6 space-x-2">
            <img
              src="/alu-logo.png"
              alt="ALU Logo"
              className="w-12 h-4"
              style={{ filter: 'drop-shadow(0 0 0 white) drop-shadow(0 0 1px black)' }}
            />
            <h1 className="text-lg font-bold text-white" style={{ filter: 'drop-shadow(0 0 0 white) drop-shadow(0 0 1px red)' }}>
              StudyBuddy
            </h1>
          </div>
          <h1 className="text-xl font-bold mb-1">Update Your Profile</h1>
          <p className="text-blue-100 text-sm">
            Keep your information current to enhance your learning experience and connect with peers effectively.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          {['Peer-to-peer learning support', 'Enhanced peer matching', 'Academic excellence together'].map((text, i) => (
            <div key={i} className="flex items-center">
              <div className="bg-yellow-400 rounded-full p-2 mr-3">
                <Check className="w-5 h-5 text-blue-800" />
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 md:w-1/2 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src={getProfileImage()}
                alt={getFullName()}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-3">{getFullName()}</h3>
          </div>

          <div className="space-y-5">
            {[{ label: 'Full Name *', value: formData.name, field: 'name', icon: User },
            { label: 'Major *', value: formData.major, field: 'major', icon: BookOpen }].map(({ label, value, field, icon: Icon }, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Study Year *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.studyYear}
                  onChange={(e) => handleInputChange('studyYear', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Select study year</option>
                  {[1, 2, 3].flatMap(y => [1, 2, 3].map(t => `Year ${y}, Trimester ${t}`)).concat('Graduate').map((val, i) => (
                    <option key={i} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {[{ label: 'Email', value: user?.email || '', icon: Mail },
            { label: 'Phone', value: user?.phone || 'Not provided', icon: Phone }].map(({ label, value, icon: Icon }, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={value}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : 'Save Changes'}
            </button>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EditProfileModal;
