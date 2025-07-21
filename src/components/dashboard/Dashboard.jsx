import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import WelcomeSection from './WelcomeSection';
import UpcomingSessions from './UpcomingSessions';
import SupportTickets from './SupportTickets';
import FindPeers from './FindPeers';
import AvailabilityEditor from './AvailabilityEditor';
import NotificationsFeed from './NotificationsFeed';
import SkillsManagement from './SkillsManagement';
import { Calendar, Users, Ticket, Search, Clock, Bell, BookOpen } from 'lucide-react';
import availabilityService from '../../services/availability/availability.service';
import skillsService from '../../services/skills/skills.service';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [userAvailabilities, setUserAvailabilities] = useState([]);
  const [userSkills, setUserSkills] = useState([]);

  // Mock data for now
  const [dashboardData, setDashboardData] = useState({
    upcomingSessions: [],
    myTickets: [],
    claimedTickets: [],
    availablePeers: [],
    loading: true
  });

  useEffect(() => {
    // Load user's availabilities and skills
    const loadUserData = async () => {
      if (user?.id) {
        try {
          // Load availabilities
          const availabilitiesResponse = await availabilityService.getUserAvailabilities(user.id);
          setUserAvailabilities(availabilitiesResponse.data || []);
          
          // Load skills
          const skillsResponse = await skillsService.getUserSkills(user.id);
          setUserSkills(skillsResponse.data || []);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();

    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        upcomingSessions: [
          {
            id: 1,
            title: 'JavaScript Fundamentals',
            peerName: 'Sarah Johnson',
            peerImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            date: '2025-01-15',
            time: '14:00',
            duration: 60,
            type: 'learner',
            meetingLink: 'https://meet.google.com/abc-def-ghi'
          },
          {
            id: 2,
            title: 'Data Structures Help',
            peerName: 'Michael Chen',
            peerImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
            date: '2025-01-16',
            time: '16:30',
            duration: 90,
            type: 'helper',
            meetingLink: 'https://meet.google.com/xyz-abc-def'
          }
        ],
        myTickets: [
          {
            id: 1,
            title: 'Need help with React Hooks',
            module: 'Frontend Development',
            status: 'open',
            createdAt: '2025-01-14',
            responses: 3
          },
          {
            id: 2,
            title: 'Database Design Questions',
            module: 'Backend Development',
            status: 'claimed',
            createdAt: '2025-01-13',
            claimedBy: 'Alex Rivera',
            responses: 1
          }
        ],
        claimedTickets: [
          {
            id: 3,
            title: 'Python Algorithm Help',
            module: 'Data Structures',
            status: 'in_progress',
            createdBy: 'Emma Wilson',
            claimedAt: '2025-01-14'
          }
        ],
        availablePeers: [
          {
            id: 1,
            name: 'David Park',
            image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
            major: 'Computer Science',
            year: 'Year 3',
            rating: 4.8,
            skills: ['JavaScript', 'React', 'Node.js'],
            availability: 'Available today',
            bio: 'Passionate about web development and helping fellow students succeed.'
          },
          {
            id: 2,
            name: 'Lisa Thompson',
            image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
            major: 'Data Science',
            year: 'Year 2',
            rating: 4.9,
            skills: ['Python', 'Machine Learning', 'Statistics'],
            availability: 'Available tomorrow',
            bio: 'Data science enthusiast with experience in ML projects.'
          }
        ],
        loading: false
      });

      setNotifications([
        {
          id: 1,
          type: 'session_booked',
          message: `Welcome to StudyBuddy, ${user?.fullname || 'Student'}! Your account is ready.`,
          time: '2 hours ago',
          read: false
        },
        {
          id: 2,
          type: 'ticket_claimed',
          message: 'Complete your profile to get better peer matches',
          time: '1 day ago',
          read: false
        },
        {
          id: 3,
          type: 'session_reminder',
          message: 'Set your availability to start helping other students',
          time: '3 days ago',
          read: true
        }
      ]);
    }, 1000);
  }, [user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'sessions', label: 'Sessions', icon: Users },
    { id: 'tickets', label: 'Support Tickets', icon: Ticket },
    { id: 'find-peers', label: 'Find Peers', icon: Search },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'skills', label: 'Skills & Modules', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <WelcomeSection user={user} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingSessions
                sessions={dashboardData.upcomingSessions}
                loading={dashboardData.loading}
                compact={true}
              />
              <SupportTickets
                myTickets={dashboardData.myTickets}
                claimedTickets={dashboardData.claimedTickets}
                loading={dashboardData.loading}
                compact={true}
              />
            </div>
            <NotificationsFeed
              notifications={notifications.slice(0, 3)}
              compact={true}
            />
          </div>
        );
      case 'sessions':
        return (
          <UpcomingSessions
            sessions={dashboardData.upcomingSessions}
            loading={dashboardData.loading}
          />
        );
      case 'tickets':
        return (
          <SupportTickets
            myTickets={dashboardData.myTickets}
            claimedTickets={dashboardData.claimedTickets}
            loading={dashboardData.loading}
          />
        );
      case 'find-peers':
        return (
          <FindPeers
            peers={dashboardData.availablePeers}
            loading={dashboardData.loading}
          />
        );
      case 'availability':
        return (
          <AvailabilityEditor 
            availabilities={userAvailabilities}
            onChange={setUserAvailabilities}
          />
        );
      case 'skills':
        return (
          <SkillsManagement
            skills={userSkills}
            onSkillsChange={setUserSkills}
          />
        );
      case 'notifications':
        return <NotificationsFeed notifications={notifications} />;
      default:
        return null;
    }
  };

  if (dashboardData.loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="overflow-x-auto">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:text-navy hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
          <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4 overflow-y-auto">
            {/* Logo and name */}
            <div className="flex items-center flex-shrink-0 px-4 mb-2">
              <img
                src="/alu-logo.png"
                alt="ALU Logo"
                className="w-12 h-4 mr-2"
                style={{
                  filter: 'drop-shadow(0 0 0 white) drop-shadow(0 0 1px black)',
                }}
              />
              <h1 className="text-xl font-bold text-navy">StudyBuddy</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${activeTab === tab.id
                      ? 'bg-navy text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
                      }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-navy'
                      }`} />
                    {tab.label}
                    {tab.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
