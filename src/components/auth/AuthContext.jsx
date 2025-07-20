import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../../services/auth/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    // Check for existing auth on app load
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            const registrationPayload = {
                fullname: userData.fullname,
                email: userData.email,
                password: userData.password,
                schoolName: userData.schoolName,
                studyYear: userData.yearOfStudy,
                major: userData.major,
                bio: userData.bio || '',
                // skills: userData.modules || [],
                role: 'BOTH',
                availabilities: userData.availableTimeSlots || []
            };

            console.log('Sending registration payload:', registrationPayload);
            const res = await authService.register(registrationPayload);
            const { data } = res;
            console.log('Registration response:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.message || 'Registration failed');
        }
    };

    const confirmRegistration = async (email, confirmationCode) => {
        try {
            const response = await fetch('https://study-buddy-api-yaoz.onrender.com/api/v1/auth/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    confirmationCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Confirmation failed');
            }

            return { success: true, data };
        } catch (error) {
            throw new Error(error.message || 'Confirmation failed');
        }
    };

    const resendConfirmationCode = async (email) => {
        try {
            const response = await fetch('https://study-buddy-api-yaoz.onrender.com/api/v1/auth/resend-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend confirmation code');
            }

            return { success: true, data };
        } catch (error) {
            throw new Error(error.message || 'Failed to resend confirmation code');
        }
    };

    const login = async (email, password) => {
        try {
           const res = await authService.login(email, password);
            const { data } = res;
            console.log('Login data:', data);

            // Store auth data
            if (data.accessToken) {
                localStorage.setItem('authToken', data.accessToken);
                localStorage.setItem('userData', JSON.stringify(data.user));
                setUser(data.user);
                setIsAuthenticated(true);
            }

            return { success: true, data };
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const signOut = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        setUser: updateUser,
        register,
        confirmRegistration,
        resendConfirmationCode,
        login,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
