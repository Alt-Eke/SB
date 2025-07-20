import React, { useState } from 'react';
import { Ticket, Clock, CheckCircle, AlertCircle, User, MessageSquare, Plus } from 'lucide-react';

const SupportTickets = ({ myTickets, claimedTickets, loading, compact = false }) => {
  const [activeTab, setActiveTab] = useState('my-tickets');
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'claimed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'claimed':
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTicketCard = (ticket, type = 'my') => (
    <div
      key={ticket.id}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
          <p className="text-sm text-gray-600">{ticket.module}</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
          {getStatusIcon(ticket.status)}
          <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Created {formatDate(ticket.createdAt)}</span>
          {ticket.responses && (
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{ticket.responses} responses</span>
            </div>
          )}
          {ticket.claimedBy && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Claimed by {ticket.claimedBy}</span>
            </div>
          )}
          {ticket.createdBy && type === 'claimed' && (
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>By {ticket.createdBy}</span>
            </div>
          )}
        </div>
        <button className="text-navy hover:text-navy-light font-medium">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
        {!compact && (
          <button
            onClick={() => setShowCreateTicket(true)}
            className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        )}
      </div>

      {!compact && (
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-tickets'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            My Tickets ({myTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('claimed-tickets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'claimed-tickets'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-600 hover:text-navy'
            }`}
          >
            Tickets I've Claimed ({claimedTickets.length})
          </button>
        </div>
      )}

      <div className="space-y-4">
        {compact ? (
          // Compact view shows both types mixed
          <>
            {myTickets.slice(0, 2).map(ticket => renderTicketCard(ticket, 'my'))}
            {claimedTickets.slice(0, 1).map(ticket => renderTicketCard(ticket, 'claimed'))}
            {(myTickets.length > 2 || claimedTickets.length > 1) && (
              <button className="w-full text-center py-3 text-navy hover:text-navy-light font-medium">
                View all tickets
              </button>
            )}
          </>
        ) : (
          // Full view with tabs
          <>
            {activeTab === 'my-tickets' && (
              <>
                {myTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                    <p className="text-gray-600 mb-4">Create a ticket when you need help with a specific topic.</p>
                    <button
                      onClick={() => setShowCreateTicket(true)}
                      className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors"
                    >
                      Create Your First Ticket
                    </button>
                  </div>
                ) : (
                  myTickets.map(ticket => renderTicketCard(ticket, 'my'))
                )}
              </>
            )}

            {activeTab === 'claimed-tickets' && (
              <>
                {claimedTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No claimed tickets</h3>
                    <p className="text-gray-600">Browse available tickets to help other students.</p>
                  </div>
                ) : (
                  claimedTickets.map(ticket => renderTicketCard(ticket, 'claimed'))
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCreateTicket(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Support Ticket</h3>
                <p className="text-gray-600">Ticket creation form will be implemented here.</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowCreateTicket(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
