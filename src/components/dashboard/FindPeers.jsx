import React, { useState } from 'react';
import { Search, Filter, Star, Calendar, MessageSquare, User, Clock } from 'lucide-react';

const FindPeers = ({ peers, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);

  const modules = [
    'All Modules',
    'Frontend Development',
    'Backend Development',
    'Data Structures',
    'Machine Learning',
    'Database Design',
    'Mobile Development'
  ];

  const availabilityOptions = [
    'Any time',
    'Available today',
    'Available tomorrow',
    'Available this week'
  ];

  const filteredPeers = peers.filter(peer => {
    const matchesSearch = peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         peer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = !selectedModule || selectedModule === 'All Modules' ||
                         peer.skills.some(skill => skill.toLowerCase().includes(selectedModule.toLowerCase()));
    const matchesAvailability = !selectedAvailability || selectedAvailability === 'Any time' ||
                               peer.availability.toLowerCase().includes(selectedAvailability.toLowerCase());
    
    return matchesSearch && matchesModule && matchesAvailability;
  });

  const handleRequestSession = (peer) => {
    setSelectedPeer(peer);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Study Peers</h2>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
          
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            {availabilityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Peer Cards */}
      {filteredPeers.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No peers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeers.map((peer) => (
            <div
              key={peer.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={peer.image}
                  alt={peer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{peer.name}</h3>
                  <p className="text-sm text-gray-600">{peer.major} • {peer.year}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{peer.rating}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{peer.bio}</p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {peer.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {peer.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{peer.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{peer.availability}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequestSession(peer)}
                  className="flex-1 bg-navy text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-navy-light transition-colors"
                >
                  Request Session
                </button>
                <button className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedPeer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowBookingModal(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedPeer.image}
                    alt={selectedPeer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedPeer.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPeer.major}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Session booking functionality will be implemented here.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Topic
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                      placeholder="What do you need help with?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-navy text-base font-medium text-white hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Request
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPeers;