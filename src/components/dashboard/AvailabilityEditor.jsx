import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import availabilityService from '../../services/availability/availability.service';
import skillsService from '../../services/skills/skills.service';
import { useAuth } from '../auth/AuthContext';

const AvailabilityEditor = ({ availabilities = [], onChange }) => {
  const { user } = useAuth();
  const [localAvailabilities, setLocalAvailabilities] = useState(availabilities);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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

  const saveChanges = async () => {
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
      setSuccess('Availability saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving availability:', error);
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

      {/* Save Changes Button */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-4 flex justify-center">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-yellow-300">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span>You have unsaved availability changes</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={discardChanges}
                className="px-2 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityEditor;
