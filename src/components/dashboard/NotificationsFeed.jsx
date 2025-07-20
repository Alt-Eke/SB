import React, { useState } from 'react';
import { Bell, Check, X, Calendar, MessageSquare, User, AlertCircle } from 'lucide-react';

const NotificationsFeed = ({ notifications, compact = false }) => {
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session_booked':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'ticket_claimed':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'session_reminder':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type, read) => {
    if (read) return 'bg-white';
    
    switch (type) {
      case 'session_booked':
        return 'bg-blue-50';
      case 'ticket_claimed':
        return 'bg-green-50';
      case 'session_reminder':
        return 'bg-orange-50';
      case 'new_message':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  const markAsRead = (notificationId) => {
    // Implementation for marking notification as read
    console.log('Marking notification as read:', notificationId);
  };

  const markAllAsRead = () => {
    // Implementation for marking all notifications as read
    console.log('Marking all notifications as read');
  };

  const deleteNotification = (notificationId) => {
    // Implementation for deleting notification
    console.log('Deleting notification:', notificationId);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {compact ? 'Recent Activity' : 'Notifications'}
          </h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        
        {!compact && unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-navy hover:text-navy-light font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs (only in full view) */}
      {!compact && (
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'session_booked', label: 'Sessions' },
            { id: 'ticket_claimed', label: 'Tickets' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-gray-600 hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border border-gray-200 rounded-lg p-4 transition-all hover:shadow-sm ${getNotificationBgColor(notification.type, notification.read)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {!compact && (
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Link (compact view only) */}
      {compact && notifications.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-navy hover:text-navy-light font-medium text-sm">
            View all notifications ({notifications.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsFeed;