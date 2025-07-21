import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import availabilityService from '../../services/availability/availability.service';
import skillsService from '../../services/skills/skills.service';
import { useAuth } from '../auth/AuthContext';

const AvailabilityEditor = ({ availabilities = [], onChange, supportAreas = [], onSupportAreasChange }) => {
  const { user } = useAuth();
  const [localAvailabilities, setLocalAvailabilities] = useState(availabilities);
  const [localSupportAreas, setLocalSupportAreas] = useState(supportAreas);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  // Update local availabilities when props change
  useEffect(() => {
    setLocalAvailabilities(availabilities);
    setHasUnsavedChanges(false);
  }, [availabilities]);

  // Update local support areas when props change
  useEffect(() => {
    setLocalSupportAreas(supportAreas);
  }, [supportAreas]);

  const addAvailability = () => {
    setError('');
    
    const newAvailability = {
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      userId: user?.id,
      isNew: true // Mark as new for saving later
    };
    
    const updated = [...localAvailabilities, newAvailability];
    setLocalAvailabilities(updated);
    setHasUnsavedChanges(true);
  };

  const removeAvailability = (index) => {
    const availability = localAvailabilities[index];
    setError('');
    
    // Mark for deletion if it has an ID, otherwise just remove from local state
    if (availability.id && !availability.isNew) {
      availability.markedForDeletion = true;
      const updated = [...localAvailabilities];
      updated[index] = availability;
      setLocalAvailabilities(updated);
    } else {
      // Remove completely if it's new
      const updated = localAvailabilities.filter((_, i) => i !== index);
      setLocalAvailabilities(updated);
    }
    
    setHasUnsavedChanges(true);
  };

  const updateAvailability = (index, field, value) => {
    const availability = localAvailabilities[index];
    const updated = localAvailabilities.map((availability, i) =>
      i === index ? { ...availability, [field]: field === 'dayOfWeek' ? parseInt(value) : value } : availability
    );
    setLocalAvailabilities(updated);
    setHasUnsavedChanges(true);
  };

  const saveAvailabilityChanges = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Handle deletions
      const toDelete = localAvailabilities.filter(a => a.markedForDeletion && a.id);
      for (const availability of toDelete) {
        await availabilityService.deleteAvailability(availability.id);
      }
      
      // Handle new creations
      const toCreate = localAvailabilities.filter(a => a.isNew && !a.markedForDeletion);
      const createdAvailabilities = [];
      for (const availability of toCreate) {
        const { isNew, markedForDeletion, ...availabilityData } = availability;
        const response = await availabilityService.createAvailability(availabilityData);
        createdAvailabilities.push(response.data);
      }
      
      // Handle updates
      const toUpdate = localAvailabilities.filter(a => a.id && !a.isNew && !a.markedForDeletion);
      const updatedAvailabilities = [];
      for (const availability of toUpdate) {
        const { markedForDeletion, ...availabilityData } = availability;
        const response = await availabilityService.updateAvailability(availability.id, availabilityData);
        updatedAvailabilities.push(response.data);
      }
      
      // Update final state
      const finalAvailabilities = [
        ...localAvailabilities.filter(a => !a.isNew && !a.markedForDeletion),
        ...createdAvailabilities
      ];
      
      setLocalAvailabilities(finalAvailabilities);
      onChange?.(finalAvailabilities);
      setHasUnsavedChanges(false);
      setSuccess('Availability changes saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving availability changes:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    setLocalAvailabilities(availabilities);
    setHasUnsavedChanges(false);
    setError('');
    setSuccess('');
  };

  const addSkill = () => {
    if (newSkill.trim() && !localSupportAreas.includes(newSkill.trim())) {
      const updated = [...localSupportAreas, newSkill.trim()];
      setLocalSupportAreas(updated);
      setNewSkill('');
      setHasUnsavedChanges(true);
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = localSupportAreas.filter(skill => skill !== skillToRemove);
    setLocalSupportAreas(updated);
    setHasUnsavedChanges(true);
  };

  const saveSkillsChanges = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      // For now, we'll send all skills as an update
      // You might want to implement a more sophisticated diff later
      await skillsService.updateSkills({ skills: localSupportAreas });
      onSupportAreasChange?.(localSupportAreas);
      setSuccess('Skills saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving skills:', error);
      setError(error.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Save availability changes
      if (hasUnsavedChanges) {
        await saveAvailabilityChanges();
      }
      
      // Save skills changes
      await saveSkillsChanges();
      
      setHasUnsavedChanges(false);
      setSuccess('All changes saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save some changes. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter out deleted availabilities for display
  const displayAvailabilities = localAvailabilities.filter(a => !a.markedForDeletion);

  const getAvailabilitiesByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => {
      grouped[day.value] = displayAvailabilities.filter(a => a.dayOfWeek === day.value);
    });
    return grouped;
  };

  const availabilitiesByDay = getAvailabilitiesByDay();

  const getDayName = (dayOfWeek) => {
    return daysOfWeek.find(day => day.value === dayOfWeek)?.label || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Don't forget to save them!
            </p>
            <div className="flex space-x-2">
              <button
                onClick={discardChanges}
                className="text-sm text-yellow-600 hover:text-yellow-800 underline"
              >
                Discard Changes
              </button>
              <button
                onClick={saveAllChanges}
                disabled={isSaving}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                {day.label.slice(0, 3)}
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

        {displayAvailabilities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            {displayAvailabilities.map((availability, index) => (
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
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs bg-gray-200 text-red-700 rounded-md hover:text-red-500 transition-colors"
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
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Slot
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
                placeholder="e.g., Data Structure and Algorithm, MySQL Databases"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Add
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
                      if (!localSupportAreas.includes(skill)) {
                        setNewSkill(skill);
                      }
                    }}
                    disabled={localSupportAreas.includes(skill)}
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

      {/* Save Changes Button */}
      {hasUnsavedChanges && (
        <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
          <button
            onClick={discardChanges}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={saveAllChanges}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Changes...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailabilityEditor;
