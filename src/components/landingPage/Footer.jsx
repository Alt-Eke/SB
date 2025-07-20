import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-20 h-10 bg-gradient-to-br flex items-center justify-center">
                                <img
                                    src="/alu-logo.png"
                                    alt="ALU Logo"
                                    className="w-100 h-100 object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">StudyBuddy</h3>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Connecting African Leadership University students for structured,
                            academic support, and shared success.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Media Links */}
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-alu-blue transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-alu-blue transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-alu-blue transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><button onClick={() => console.log("FAQ clicked")} className="text-gray-400 hover:text-white transition-colors">FAQ</button></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => console.log("Help Center clicked")} className="text-gray-400 hover:text-white transition-colors">Help Center</button></li>
                            <li><button onClick={() => console.log("Contact Us clicked")} className="text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
                            <li><button onClick={() => console.log("Community Guidelines clicked")} className="text-gray-400 hover:text-white transition-colors">Community Guidelines</button></li>
                            <li><button onClick={() => console.log("Report Issue clicked")} className="text-gray-400 hover:text-white transition-colors">Report Issue</button></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                        © 2025 ALU StudyBuddy. All rights reserved.
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <button onClick={() => console.log("Privacy Policy clicked")} className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </button>
                        <button onClick={() => console.log("Terms of Service clicked")} className="text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </button>
                        <button onClick={() => console.log("Cookie Policy clicked")} className="text-gray-400 hover:text-white transition-colors">
                            Cookie Policy
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
