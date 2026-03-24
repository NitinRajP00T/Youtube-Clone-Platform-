import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleAuth = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (token) {
                try {
                    dispatch(loginStart());
                    // Temporarily store the token so axios can use it for authAPI.getMe()
                    localStorage.setItem('token', token);
                    
                    // Fetch user details using the new token
                    const res = await authAPI.getMe();
                    
                    // Update Redux state
                    dispatch(loginSuccess({ user: res.data.data.user, token }));
                    
                    navigate('/');
                } catch (err) {
                    dispatch(loginFailure('Failed to fetch user data after Google login'));
                    navigate('/auth');
                }
            } else {
                dispatch(loginFailure('No Google token received'));
                navigate('/auth');
            }
        };

        handleAuth();
    }, [location, dispatch, navigate]);

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
            <p>Authenticating...</p>
        </div>
    );
};

export default GoogleCallback;
