import React, { useState, useEffect } from 'react';
import { Plus, X, BookOpen, Save, RotateCcw, Check, AlertCircle } from 'lucide-react';
import skillsService from '../../services/skills/skills.service';
import { useAuth } from '../auth/AuthContext';

const SkillsManagement = ({ skills = [], onSkillsChange }) => {
  const { user } = useAuth();
  const [localSkills, setLocalSkills] = useState(skills);
  const [newSkill, setNewSkill] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update local skills when props change
  useEffect(() => {
    setLocalSkills(skills);
    setHasUnsavedChanges(false);
  }, [skills]);

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !localSkills.includes(trimmedSkill)) {
      const updated = [...localSkills, trimmedSkill];
      setLocalSkills(updated);
      setNewSkill('');
      setHasUnsavedChanges(true);
      setError('');
    } else if (localSkills.includes(trimmedSkill)) {
      setError('This skill is already added');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = localSkills.filter(skill => skill !== skillToRemove);
    setLocalSkills(updated);
    setHasUnsavedChanges(true);
    setError('');
  };

  const addSuggestedSkill = (skill) => {
    if (!localSkills.includes(skill)) {
      const updated = [...localSkills, skill];
      setLocalSkills(updated);
      setHasUnsavedChanges(true);
      setError('');
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await skillsService.updateSkills({ skills: localSkills });
      onSkillsChange?.(localSkills);
      setHasUnsavedChanges(false);
      setSuccess('Skills updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving skills:', error);
      setError(error.message || 'Failed to save skills');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    setLocalSkills(skills);
    setNewSkill('');
    setHasUnsavedChanges(false);
    setError('');
    setSuccess('');
  };

  const getSkillsByCategory = () => {
    const categorized = {};
    const uncategorized = [];

    localSkills.forEach(skill => {
      let found = false;
      for (const [category, categorySkills] of Object.entries(skillCategories)) {
        if (categorySkills.includes(skill)) {
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(skill);
          found = true;
          break;
        }
      }
      if (!found) {
        uncategorized.push(skill);
      }
    });

    if (uncategorized.length > 0) {
      categorized['Other Skills'] = [...(categorized['Other Skills'] || []), ...uncategorized];
    }

    return categorized;
  };

  const categorizedSkills = getSkillsByCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Skills & Modules Management</h2>
            <p className="text-gray-600">Manage the skills and modules you can help other students with</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{localSkills.length}</div>
            <div className="text-sm text-gray-600">Total Skills</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{Object.keys(categorizedSkills).length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {hasUnsavedChanges ? 'Unsaved' : 'Saved'}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 font-medium">
                You have unsaved changes to your skills
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={discardChanges}
                className="text-sm text-yellow-600 hover:text-yellow-800 underline"
              >
                Discard Changes
              </button>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-1"
              >
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-600 font-medium">{success}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Add New Skill */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill or Module</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            placeholder="e.g., React, Data Structures, Machine Learning..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addSkill}
            disabled={!newSkill.trim() || localSkills.includes(newSkill.trim())}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Current Skills by Category */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Skills & Modules</h3>
        
        {localSkills.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h4>
            <p className="text-gray-600">Add your first skill to start helping other students!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{category}</span>
                  <span className="text-sm text-gray-500">({categorySkills.length})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-red-600 transition-colors"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Changes Button (Fixed at bottom when changes exist) */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-4 flex justify-center">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span>You have unsaved changes</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={discardChanges}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Discard</span>
              </button>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
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

export default SkillsManagement;