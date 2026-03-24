import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            let res;
            if (isLogin) {
                res = await authAPI.login({ email: formData.email, password: formData.password });
            } else {
                res = await authAPI.register(formData);
            }
            dispatch(loginSuccess({ user: res.data.data.user, token: res.data.token }));
            navigate('/');
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Authentication failed'));
        }
    };

    // const handleGoogleSuccess = async (credentialResponse) => {
    //     dispatch(loginStart());
    //     try {
    //         const res = await authAPI.google({ token: credentialResponse.credential });
    //         dispatch(loginSuccess({ user: res.data.data.user, token: res.data.token }));
    //         navigate('/');
    //     } catch (err) {
    //         dispatch(loginFailure(err.response?.data?.message || 'Google Authentication failed'));
    //     }
    // };

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] w-full max-w-[450px] border border-[#3f3f3f] rounded-lg p-10 flex flex-col items-center">
                {/* Google / YouTube Style Logo Space */}
                <div className="mb-4">
                    <svg height="24" viewBox="0 0 90 20" width="90" xmlns="http://www.w3.org/2000/svg">
                        <path d="m27.9727 3.12324c-2.7681-.50244-12.7937-.50244-15.5619 0-2.3831.42909-4.2343 2.50296-4.6644 4.88145-.5121 2.89431-.5121 9.09631 0 11.99061.4301 2.3785 2.2813 4.4524 4.6644 4.8815 2.7682.5024 12.7938.5024 15.5619 0 2.3832-.4291 4.2343-2.503 4.6644-4.8815.5122-2.8943.5122-9.0963 0-11.99061-.4301-2.37849-2.2812-4.45236-4.6644-4.88145zm-10.3644 14.16786v-9.5822l8.8093 4.7911z" fill="#f00" transform="translate(-7.7464 -2.5)"/>
                        <path d="m42.5317 21.082v-14.7876l3.5e-3 -1.35332h3.2921l.2407 2.05942h.086c.8664-1.57946 2.4552-2.5292 4.2955-2.5292 2.9125 0 4.153 1.99612 4.153 5.48002v11.1307h-3.4111v-10.7042c0-2.0722-.5335-3.0805-2.0169-3.0805-1.1895 0-2.31.761-2.8797 1.8488v11.9359zm18.8471-15.0116h-3.411l-2.07 7.7915c-.5697 2.0721-1.0186 3.8643-1.2721 5.3857h-.0861c-.2535-1.5594-.6826-3.3516-1.2908-5.3857l-2.1883-7.7915h-3.5298l4.8966 14.7876v6.417h3.4111v-6.417zm6.7323 15.1923c-3.6649 0-4.6946-2.5835-4.6946-6.8407v-2.094c0-4.44453 1.2589-6.96022 4.8149-6.96022 3.5152 0 4.5126 2.38883 4.5126 6.96022v2.094c0 4.312-.9774 6.8407-4.6329 6.8407zm0-2.6186c.928 0 1.1687-1.2828 1.1687-3.8016v-2.8242c0-2.404-.2606-3.7025-1.1687-3.7025-.8779 0-1.1485 1.2985-1.1485 3.7025v2.8242c0 2.5414.2505 3.8016 1.1485 3.8016zm12.6322-12.8087v15.2284h-2.7317l-.3171-2.2612h-.0835c-.7184 1.4883-2.1287 2.4795-3.8015 2.4795-2.5905 0-3.6121-1.8596-3.6121-5.698v-9.7487h3.4001v9.3339c0 1.9304.421 2.8094 1.7062 2.8094.9928 0 1.9332-.6471 2.3275-1.5794v-10.5639zm8.5639-2.31174h3.4111v17.32334h-3.4111zv-17.32334h-3.411v17.32334h3.411zm11.1648 10.15814c0 3.8969-.8725 7.1528-4.7042 7.1528-1.7451 0-3.3218-.8882-4.0539-2.2813h-.0861v2.1001l-3.2921.0336v-24.62933h3.411v8.59123c.6917-1.1664 2.1158-1.93482 3.7635-1.93482 3.6514 0 4.9618 2.87162 4.9618 7.07902zm-3.4111-.334c0-2.6976-.3209-4.2269-1.4238-4.2269-.9729 0-1.9149.6644-2.3168 1.6373v6.3364c.361.6429 1.1534 1.0533 1.9358 1.0533 1.183 0 1.8048-1.4893 1.8048-4.8001z" fill="#fff" transform="translate(-7.7464 -2.5)"/>
                    </svg>
                </div>
                
                <h1 className="text-2xl font-normal text-[#f1f1f1] mb-2">
                    {isLogin ? 'Sign in' : 'Create a YouTube Account'}
                </h1>
                <p className="text-[#aaaaaa] mb-8 text-[15px]">
                    to continue to YouTube
                </p>

                <div className="w-full">
                    {error && (
                        <div className="bg-[#422020] border-l-4 border-red-500 text-[#f1f1f1] p-3 mb-6 text-sm rounded-r">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    name="username"
                                    id="username"
                                    placeholder=" "
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="block px-3.5 pb-2.5 pt-5 w-full text-sm text-[#f1f1f1] bg-transparent rounded-md border border-[#555] appearance-none focus:outline-none focus:ring-0 focus:border-[#3ea6ff] peer"
                                />
                                <label 
                                    htmlFor="username" 
                                    className="absolute text-[#aaaaaa] duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#3ea6ff]"
                                >
                                    Username
                                </label>
                            </div>
                        )}
                        <div className="relative group">
                            <input 
                                type="email" 
                                name="email"
                                id="email"
                                placeholder=" "
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="block px-3.5 pb-2.5 pt-5 w-full text-sm text-[#f1f1f1] bg-transparent rounded-md border border-[#555] appearance-none focus:outline-none focus:ring-0 focus:border-[#3ea6ff] peer"
                            />
                            <label 
                                htmlFor="email" 
                                className="absolute text-[#aaaaaa] duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#3ea6ff]"
                            >
                                Email or phone
                            </label>
                        </div>
                        <div className="relative group">
                            <input 
                                type="password" 
                                name="password"
                                id="password"
                                placeholder=" "
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="block px-3.5 pb-2.5 pt-5 w-full text-sm text-[#f1f1f1] bg-transparent rounded-md border border-[#555] appearance-none focus:outline-none focus:ring-0 focus:border-[#3ea6ff] peer"
                            />
                            <label 
                                htmlFor="password" 
                                className="absolute text-[#aaaaaa] duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#3ea6ff]"
                            >
                                Enter your password
                            </label>
                        </div>
                        
                        {!isLogin && (
                            <p className="text-[12px] text-[#aaaaaa] mt-[-10px] ml-1">
                                Use 8 or more characters with a mix of letters, numbers & symbols
                            </p>
                        )}

                        <div className="text-sm mt-2">
                            <span className="text-[#aaaaaa] mr-1">Not your computer? Use Guest mode to sign in privately. </span>
                            <button type="button" className="text-[#3ea6ff] hover:underline hover:text-[#71bbfc] font-medium bg-transparent border-none p-0 cursor-pointer">
                                Learn more about using Guest mode
                            </button>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    dispatch(loginFailure(null));
                                    setFormData({ username: '', email: '', password: '' });
                                }} 
                                className="text-[#3ea6ff] hover:bg-[#263850] px-4 py-2 rounded-full font-medium text-sm transition-colors"
                            >
                                {isLogin ? 'Create account' : 'Sign in instead'}
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-[#3ea6ff] hover:bg-[#65b8ff] disabled:bg-[#3ea6ff]/50 disabled:text-[#0f0f0f]/50 text-[#0f0f0f] font-medium px-6 py-2 rounded-full text-sm transition-colors"
                            >
                                {loading ? 'Next...' : 'Next'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 w-full">
                        <div className="flex items-center w-full mb-6">
                            <div className="flex-grow border-t border-[#3f3f3f]"></div>
                            <span className="px-4 text-[#aaaaaa] text-sm">or</span>
                            <div className="flex-grow border-t border-[#3f3f3f]"></div>
                        </div>
                        
                        <div className="flex justify-center w-full">
                            {/* <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => dispatch(loginFailure('Google Login Failed'))}
                                theme="filled_black"
                                shape="circle"
                                text={isLogin ? 'signin_with' : 'signup_with'}
                                size="large"
                                width="300"
                            /> */}
                            <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
                                className="flex items-center justify-center gap-2 bg-white text-black rounded-full px-6 py-3 w-[300px] hover:bg-gray-200 transition-colors font-medium cursor-pointer max-w-full"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer links typical of Google login */}
            <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center text-[12px] text-[#aaaaaa] gap-6 bg-[#0f0f0f]">
                <button className="hover:bg-[#272727] px-2 py-1 rounded">Help</button>
                <button className="hover:bg-[#272727] px-2 py-1 rounded">Privacy</button>
                <button className="hover:bg-[#272727] px-2 py-1 rounded">Terms</button>
            </div>
        </div>
    );
};

export default AuthPage;

