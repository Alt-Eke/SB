import React, { useState } from 'react';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import availabilityService from '../../services/availability/availability.service';
import skillsService from '../../services/skills/skills.service';
import { useAuth } from '../auth/AuthContext';

const AvailabilityEditor = ({ availabilities = [], onChange, supportAreas = [], onSupportAreasChange }) => {
  const { user } = useAuth();
  const [localAvailabilities, setLocalAvailabilities] = useState(availabilities);
  const [localSupportAreas, setLocalSupportAreas] = useState(supportAreas);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const daysOfWeek = [
    { value: 0, label: 'Sunday'},
    { value: 1, label: 'Monday'},
    { value: 2, label: 'Tuesday'},
    { value: 3, label: 'Wednesday'},
    { value: 4, label: 'Thursday'},
    { value: 5, label: 'Friday'},
    { value: 6, label: 'Saturday'}
  ];

  const addAvailability = async () => {
    setIsLoading(true);
    setError('');
    
    const newAvailability = {
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      userId: user?.id
    };
    
    try {
      const response = await availabilityService.createAvailability(newAvailability);
      const updated = [...localAvailabilities, response.data || newAvailability];
      setLocalAvailabilities(updated);
      onChange?.(updated);
      setSuccess('Availability slot added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding availability:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAvailability = async (index) => {
    const availability = localAvailabilities[index];
    
    if (!availability.id) {
      // If no ID, just remove from local state
      const updated = localAvailabilities.filter((_, i) => i !== index);
      setLocalAvailabilities(updated);
      onChange?.(updated);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await availabilityService.deleteAvailability(availability.id);
      const updated = localAvailabilities.filter((_, i) => i !== index);
      setLocalAvailabilities(updated);
      onChange?.(updated);
      setSuccess('Availability slot removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error removing availability:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvailability = async (index, field, value) => {
    const availability = localAvailabilities[index];
    const updated = localAvailabilities.map((availability, i) =>
      i === index ? { ...availability, [field]: field === 'dayOfWeek' ? parseInt(value) : value } : availability
    );
    setLocalAvailabilities(updated);
    onChange?.(updated);
    
    // If availability has an ID, update it on the server
    if (availability.id) {
      try {
        const updatedAvailability = { ...availability, [field]: field === 'dayOfWeek' ? parseInt(value) : value };
        await availabilityService.updateAvailability(availability.id, updatedAvailability);
      } catch (error) {
        console.error('Error updating availability:', error);
        setError('Failed to update availability on server');
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const getDayName = (dayOfWeek) => {
    return daysOfWeek.find(day => day.value === dayOfWeek)?.label || 'Unknown';
  };

  const getAvailabilitiesByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => {
      grouped[day.value] = localAvailabilities.filter(a => a.dayOfWeek === day.value);
    });
    return grouped;
  };

  const addSkill = async () => {
    if (newSkill.trim() && !localSupportAreas.includes(newSkill.trim())) {
      setIsLoading(true);
      setError('');
      
      const updated = [...localSupportAreas, newSkill.trim()];
      
      try {
        await skillsService.updateSkills({ skills: [newSkill.trim()] });
        setLocalSupportAreas(updated);
        setNewSkill('');
        onSupportAreasChange?.(updated);
        setSuccess('Skill added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error adding skill:', error);
        setError(error.message);
        setTimeout(() => setError(''), 5000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeSkill = async (skillToRemove) => {
    setIsLoading(true);
    setError('');
    
    try {
      await skillsService.deleteSkill({ skill: skillToRemove });
      const updated = localSupportAreas.filter(skill => skill !== skillToRemove);
      setLocalSupportAreas(updated);
      onSupportAreasChange?.(updated);
      setSuccess('Skill removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error removing skill:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const availabilitiesByDay = getAvailabilitiesByDay();

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Weekly Grid Overview */}
      <div className="bg-gray-50 rounded-md shadow-sm border border-gray-200 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Clock className="w-4" />
          Weekly Availability
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => (
            <div key={day.value} className="bg-white rounded border p-2 min-h-[80px]">
              <div className="font-medium text-xs text-center mb-2 text-gray-700">
                {day.short}
              </div>
              <div className="space-y-1">
                {availabilitiesByDay[day.value].map((availability, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded text-center"
                  >
                    {availability.startTime}-{availability.endTime}
                  </div>
                ))}
                {availabilitiesByDay[day.value].length === 0 && (
                  <div className="text-gray-400 text-xs text-center">--</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Schedule */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-1">Time Slots</h4>

        {localAvailabilities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            {localAvailabilities.map((availability, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-lg border hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <label className="block font-medium text-xs text-gray-700 mb-1">Day</label>
                      <select
                        value={availability.dayOfWeek}
                        onChange={(e) => updateAvailability(index, 'dayOfWeek', e.target.value)}
                        className="px-2 py-1.5 font-medium text-xs border border-gray-300 rounded-sm"
                      >
                        {daysOfWeek.map(day => (
                          <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={availability.startTime ? availability.startTime.split(':')[0] : '09'}
                          onChange={(e) => {
                            const hour = e.target.value.padStart(2, '0');
                            const currentTime = availability.startTime || '09:00';
                            const minute = currentTime.split(':')[1] || '00';
                            updateAvailability(index, 'startTime', `${hour}:${minute}`);
                          }}
                          className="w-12 px-1 py-1.5 text-xs text-center border border-gray-300 rounded-sm outline-gray-500"
                          placeholder="HH"
                        />
                        <span className="text-xs text-gray-500">:</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={availability.startTime ? availability.startTime.split(':')[1] : '00'}
                          onChange={(e) => {
                            const currentTime = availability.startTime || '09:00';
                            const hour = currentTime.split(':')[0] || '09';
                            const minute = e.target.value.padStart(2, '0');
                            updateAvailability(index, 'startTime', `${hour}:${minute}`);
                          }}
                          className="w-12 px-1 py-1.5 text-xs text-center border border-gray-300 rounded-sm outline-gray-500"
                          placeholder="MM"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={availability.endTime ? availability.endTime.split(':')[0] : '10'}
                          onChange={(e) => {
                            const hour = e.target.value.padStart(2, '0');
                            const currentTime = availability.endTime || '10:00';
                            const minute = currentTime.split(':')[1] || '00';
                            updateAvailability(index, 'endTime', `${hour}:${minute}`);
                          }}
                          className="w-12 px-1 py-1.5 text-xs text-center border border-gray-300 rounded-sm outline-gray-500"
                          placeholder="HH"
                        />
                        <span className="text-xs text-gray-500">:</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={availability.endTime ? availability.endTime.split(':')[1] : '00'}
                          onChange={(e) => {
                            const currentTime = availability.endTime || '10:00';
                            const hour = currentTime.split(':')[0] || '10';
                            const minute = e.target.value.padStart(2, '0');
                            updateAvailability(index, 'endTime', `${hour}:${minute}`);
                          }}
                          className="w-12 px-1 py-1.5 text-xs text-center border border-gray-300 rounded-sm outline-gray-500"
                          placeholder="MM"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => removeAvailability(index)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs bg-gray-200 text-red-700 rounded-md hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Slot
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                    <strong>{getDayName(availability.dayOfWeek)}</strong>: {availability.startTime} - {availability.endTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-start">
          <button
            onClick={addAvailability}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isLoading ? 'Adding...' : 'Add Slot'}
          </button>
        </div>
      </div>

      {/* Support Areas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Support Areas (Skills/Modules I Can Help With)</h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Skills */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {localSupportAreas.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {localSupportAreas.length === 0 && (
              <p className="text-gray-500 italic">No skills added yet</p>
            )}
          </div>

          {/* Add New Skill */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-1">Add new Skill/Module</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g., Data Structure and Algorithn, MySQL Databases"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                {isLoading ? 'Adding...' : 'Add'}
              </button>
            </div>

            {/* Suggested Skills */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Skills</h4>
              <div className="flex flex-wrap gap-2">
                {['Web Infrastructure', 'Frontend development', 'Linux/Shell Scripting', 'Enterprise Web Development', 'DevOps', 'Mobile Development'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (!localSupportAreas.includes(skill) && !isLoading) {
                        setNewSkill(skill);
                        addSkill();
                      }
                    }}
                    disabled={localSupportAreas.includes(skill) || isLoading}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityEditor;
