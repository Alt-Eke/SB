import React from 'react';

import { useAuth } from '../auth/AuthContext';

const LandingPage = ({ onShowAuth }) => {
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            // User is already authenticated, redirect to dashboard or main app
            console.log("User is authenticated, redirect to dashboard");
        } else {
            // Show authentication modal with signup mode
            onShowAuth('signup');
        }
    };

    const handleLearnMore = () => {
        console.log("Learn More action triggered");
        // Scroll to features section
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFindBuddy = () => {
        // for buddy search page
    };



    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative text-white">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-navy">
                            Connect. Support. <span className="text-yellow-300">Succeed!</span>
                        </h1>
                        <p className="text-xl md:text-xl mb-8 text-blue-400 max-w-4xl mx-auto">
                           Peer-powered academic support platform, built for ALU students, by ALU student. Are you stuck on a concept or ready to lend a hand? StudyBuddy connects you with the right peers based on skills, availability, and course context.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleGetStarted}
                                className="btn-primary text-lg px-8 py-4 bg-yellow-400 text-alu-blue"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={handleLearnMore}
                                className="btn-secondary text-lg px-8 py-4 border-white text-red hover:bg-white hover:text-alu-blue"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2">
                                --
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">
                                Registered Users (Coming Soon)
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2">
                                --
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">
                                Study Sessions (Coming Soon)
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2">
                                --
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">
                                Satisfaction Rate (Coming Soon)
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2">
                                --
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 font-medium">
                                Resolved Tickets (Coming Soon)
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-custom-off-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-custom-text-dark mb-4 font-lexend">
                            How it Works
                        </h2>
                        <p className="text-xl text-custom-dark-gray max-w-3xl mx-auto">
                            Our platform makes it easy to find academic support and share knowledge
                            with fellow ALU students across all courses, its modules and area of specialization.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1: Dual Registration */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-custom-light-gray">
                            <div className="w-12 h-12 bg-navy-lighter rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-custom-text-dark font-lexend">Choose Your Role</h3>
                            <p className="text-custom-dark-gray leading-relaxed">
                                Register as a Buddy (helper) or Learner (seeker) based on your strengths
                                and academic needs. Switch roles anytime!
                            </p>
                        </div>

                        {/* Feature 2: Smart Search */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-custom-light-gray">
                            <div className="w-12 h-12 bg-navy-lighter rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-custom-text-dark font-lexend">Smart Search</h3>
                            <p className="text-custom-dark-gray leading-relaxed">
                                Find support by topic, module, course, or project type. Our intelligent
                                matching connects you with the right peers.
                            </p>
                        </div>

                        {/* Feature 3: Easy Booking */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-custom-light-gray">
                            <div className="w-12 h-12 bg-navy-lighter rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-custom-text-dark font-lexend">Book Sessions</h3>
                            <p className="text-custom-dark-gray leading-relaxed">
                                Schedule one-on-one or group study sessions with available buddies.
                                Flexible timing that works for everyone.
                            </p>
                        </div>

                        {/* Feature 4: Support Tickets */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-custom-light-gray">
                            <div className="w-12 h-12 bg-navy-lighter rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-custom-text-dark font-lexend">Raise Support Tickets</h3>
                            <p className="text-custom-dark-gray leading-relaxed">
                                Can't find a buddy? Create a support ticket and let qualified peers
                                reach out to help with your academic challenges.
                            </p>
                        </div>

                        {/* Feature 5: Community Driven */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-custom-light-gray">
                            <div className="w-12 h-12 bg-navy-lighter rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-custom-text-dark font-lexend">Community Driven</h3>
                            <p className="text-custom-dark-gray leading-relaxed">
                                Built by ALU students, for ALU students. Share knowledge, build
                                connections, and grow together as a community.
                            </p>
                        </div>

                        {/* Feature 6: Cross-Campus */}
                        <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-custom-light-gray">
                            <div className="w-12 h-12 bg-navy-lighter rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-custom-text-dark font-lexend">Cross-Campus Support</h3>
                            <p className="text-custom-dark-gray leading-relaxed">
                                Support or seek support from BSE, BEL students. Diverse perspectives
                                and expertise from across the ALU network.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
