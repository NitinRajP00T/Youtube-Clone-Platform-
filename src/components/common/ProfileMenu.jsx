import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { 
    UserSquare2, LogOut, Settings, HelpCircle, User, MessageSquareWarning,
    MonitorPlay, DollarSign, ShieldAlert, Globe, Keyboard, Database, ChevronRight, Moon, Sun
} from 'lucide-react';

const ProfileMenu = () => {
    const { user } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.addEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setIsOpen(false);
        navigate('/');
    };

    const firstLetter = user?.username?.[0]?.toUpperCase() || 'U';

    const MenuItem = ({ icon: Icon, label, onClick, link, extraIcon: ExtraIcon }) => {
        const content = (
            <div className="flex items-center gap-4 px-4 py-2 hover:bg-black/5 dark:hover:bg-yt-hover transition-colors rounded-lg mx-2 cursor-pointer">
                {Icon && <Icon size={20} className="text-gray-600 dark:text-yt-text" />}
                <span className="text-[14px] text-gray-800 dark:text-yt-text flex-1">{label}</span>
                {ExtraIcon && <ExtraIcon size={16} className="text-gray-500 dark:text-yt-text-second" />}
            </div>
        );

        if (link) {
            return (
                <Link to={link} onClick={() => setIsOpen(false)}>
                    {content}
                </Link>
            );
        }

        return (
            <div onClick={onClick}>
                {content}
            </div>
        );
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Profile Avatar Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-yt-bg transition-all"
            >
                {/* Fallback avatar if user has no image */}
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                    <span>{firstLetter}</span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[300px] bg-white dark:bg-[#282828] rounded-xl shadow-[0_4px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_32px_0_rgba(0,0,0,0.6)] py-2 border border-black/10 dark:border-yt-border/40 z-50 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Header Section */}
                    <div className="flex px-4 py-2 mb-2">
                        <div className="w-10 h-10 mr-4 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center font-bold text-white text-lg mt-1">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span>{firstLetter}</span>
                            )}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-[16px] font-medium text-gray-900 dark:text-yt-text truncate">{user?.username}</span>
                            <span className="text-[14px] text-gray-600 dark:text-yt-text-second truncate mb-2">@{user?.username?.toLowerCase() || 'user'}</span>
                            <Link 
                                to={user?.channel ? `/channel/${user.channel}` : '/channel/create'} 
                                onClick={() => setIsOpen(false)}
                                className="text-[#065fd4] dark:text-[#3ea6ff] text-[14px] font-medium hover:underline inline-block w-fit"
                            >
                                View your channel
                            </Link>
                        </div>
                    </div>

                    <div className="h-[1px] bg-black/10 dark:bg-yt-border/40 my-2"></div>

                    {/* First Section */}
                    <div className="py-1">
                        <MenuItem icon={User} label="Google Account" />
                        <MenuItem icon={UserSquare2} label="Switch account" extraIcon={ChevronRight} />
                        <MenuItem icon={LogOut} label="Sign out" onClick={handleLogout} />
                    </div>

                    <div className="h-[1px] bg-black/10 dark:bg-yt-border/40 my-2"></div>

                    {/* Second Section */}
                    <div className="py-1">
                        <MenuItem icon={MonitorPlay} label="YouTube Studio" />
                        <MenuItem icon={DollarSign} label="Purchases and memberships" />
                    </div>

                    <div className="h-[1px] bg-black/10 dark:bg-yt-border/40 my-2"></div>

                    {/* Third Section */}
                    <div className="py-1">
                        <MenuItem icon={Database} label="Your data in YouTube" />
                        <MenuItem 
                            icon={theme === 'dark' ? Moon : Sun} 
                            label={`Appearance: ${theme === 'dark' ? 'Dark' : 'Light'}`} 
                            onClick={() => dispatch(toggleTheme())} 
                            extraIcon={ChevronRight} 
                        />
                        <MenuItem icon={Globe} label="Language" extraIcon={ChevronRight} />
                        <MenuItem icon={ShieldAlert} label="Restricted mode" extraIcon={ChevronRight} />
                        <MenuItem icon={Globe} label="Location" extraIcon={ChevronRight} />
                        <MenuItem icon={Keyboard} label="Keyboard shortcuts" />
                    </div>

                    <div className="h-[1px] bg-black/10 dark:bg-yt-border/40 my-2"></div>

                    {/* Fourth Section */}
                    <div className="py-1">
                        <MenuItem icon={Settings} label="Settings" />
                    </div>

                    <div className="h-[1px] bg-black/10 dark:bg-yt-border/40 my-2"></div>

                    {/* Fifth Section */}
                    <div className="py-1">
                        <MenuItem icon={HelpCircle} label="Help" />
                        <MenuItem icon={MessageSquareWarning} label="Send feedback" />
                    </div>

                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
