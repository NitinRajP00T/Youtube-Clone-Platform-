import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Home, Zap, Tv, ChevronRight, History, ListVideo, 
    Clock, ThumbsUp, PlaySquare, Download, GraduationCap,
    ShoppingBag, Music, Film, Radio, Gamepad2, Newspaper,
    Trophy, Shirt, Podcast, Gamepad, Youtube, Smile, Flag,
    UserCircle, ChevronDown, ChevronUp
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, link, extraIcon: ExtraIcon, colorIcon }) => {
    const content = (
        <div className={`flex items-center gap-5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
            active ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'
        }`}>
            {Icon && <Icon size={24} className={colorIcon ? colorIcon : (active ? "text-black dark:text-white" : "text-black dark:text-white")} strokeWidth={active ? 2.5 : 2} />}
            <span className={`text-[14px] flex-1 line-clamp-1 ${active ? 'font-medium' : 'font-normal'}`}>
                {label}
            </span>
            {ExtraIcon && <ExtraIcon size={18} className="text-black dark:text-white" />}
        </div>
    );

    if (link) {
        return <Link to={link}>{content}</Link>;
    }
    
    return <div onClick={onClick}>{content}</div>;
};

// Subscriptions placeholder data
const SUBSCRIPTIONS = [
    { name: 'Campusmonk', imgUrl: 'https://ui-avatars.com/api/?name=C&background=facc15&color=fff&rounded=true' },
    { name: 'Last moment tuitions', imgUrl: 'https://ui-avatars.com/api/?name=L&background=ef4444&color=fff&rounded=true' },
    { name: 'Kaka', imgUrl: 'https://ui-avatars.com/api/?name=K&background=1f2937&color=fff&rounded=true' },
    { name: 'Sriniously', imgUrl: 'https://ui-avatars.com/api/?name=S&background=9ca3af&color=fff&rounded=true' },
    { name: 'OnlineStudy4u', imgUrl: 'https://ui-avatars.com/api/?name=O&background=22c55e&color=fff&rounded=true' },
    { name: 'Exponent', imgUrl: 'https://ui-avatars.com/api/?name=E&background=9333ea&color=fff&rounded=true' },
    { name: 'Nitish Rajput', imgUrl: 'https://ui-avatars.com/api/?name=N&background=1e40af&color=fff&rounded=true' },
];

const Sidebar = () => {
    // Get real authentication state from Redux store
    const { isAuthenticated: isLoggedIn } = useSelector(state => state.auth);
    const [showMoreExplore, setShowMoreExplore] = useState(false);
    const location = useLocation();

    // Dynamically check the current path for active styling on "Home".
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-60 lg:w-[240px] hidden md:flex shrink-0 flex-col h-full bg-white dark:bg-yt-bg text-black dark:text-[#f1f1f1] border-r border-black/5 dark:border-white/10 relative group transition-colors overflow-hidden">
            
            {/* Scrollable container with custom thin scrollbar */}
            <div className="flex-1 overflow-y-auto px-3 py-2 
                [&::-webkit-scrollbar]:w-2 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                [&::-webkit-scrollbar-thumb]:bg-transparent 
                group-hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 
                dark:group-hover:[&::-webkit-scrollbar-thumb]:bg-[#717171] 
                overflow-x-hidden">

                {/* Section 1: Main Navigation */}
                <div className="pb-3 border-b border-black/10 dark:border-white/10">
                    <SidebarItem icon={Home} label="Home" link="/" active={isActive('/')} />
                    <SidebarItem icon={Zap} label="Shorts" />
                    <SidebarItem icon={Tv} label="Subscriptions" />
                </div>

                {/* Section 2: You (Logged Out vs Logged In) */}
                <div className="py-3 border-b border-black/10 dark:border-white/10">
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center gap-2 font-medium text-[16px] px-3 py-1.5 mb-1 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-lg">
                                <span>You</span>
                                <ChevronRight size={18} />
                            </div>
                            <SidebarItem icon={History} label="History" />
                            <SidebarItem icon={ListVideo} label="Playlists" />
                            <SidebarItem icon={Clock} label="Watch Later" />
                            <SidebarItem icon={ThumbsUp} label="Liked videos" />
                            <SidebarItem icon={PlaySquare} label="Your videos" />
                            <SidebarItem icon={Download} label="Downloads" />
                            <SidebarItem icon={GraduationCap} label="Courses" />
                            <SidebarItem icon={ChevronDown} label="Show more" />
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 font-medium text-[16px] px-3 py-1.5 mb-1 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-lg">
                                <span>You</span>
                            </div>
                            <SidebarItem icon={History} label="History" />
                        </>
                    )}
                </div>

                {/* Sign In Box (Logged Out ONLY) */}
                {!isLoggedIn && (
                    <div className="py-4 px-4 border-b border-black/10 dark:border-white/10">
                        <p className="text-[14px] leading-tight mb-3">
                            Sign in to like videos, comment and subscribe.
                        </p>
                        <Link 
                            to="/auth" 
                            className="inline-flex items-center gap-2 text-[#065fd4] dark:text-[#3ea6ff] border border-gray-200 dark:border-white/20 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-[#3ea6ff]/20 transition-colors"
                        >
                            <UserCircle size={20} />
                            <span className="font-medium text-sm">Sign in</span>
                        </Link>
                    </div>
                )}

                {/* Subscriptions List (Logged In ONLY) */}
                {isLoggedIn && (
                    <div className="py-3 border-b border-black/10 dark:border-white/10">
                        <h3 className="text-[16px] font-medium px-3 py-1.5 mb-1">Subscriptions</h3>
                        {SUBSCRIPTIONS.map((sub, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <img src={sub.imgUrl} alt={sub.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-[14px] truncate w-28">{sub.name}</span>
                                </div>
                                {/* Mock unread badge if needed, e.g. a blue dot */}
                                <div className="w-1 h-1 bg-[#3ea6ff] rounded-full mr-2"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Explore Section */}
                <div className="py-3 border-b border-black/10 dark:border-white/10">
                    <h3 className="text-[16px] font-medium px-3 py-1.5 mb-1">Explore</h3>
                    <SidebarItem icon={ShoppingBag} label="Shopping" />
                    <SidebarItem icon={Music} label="Music" />
                    <SidebarItem icon={Film} label="Films" />
                    
                    {isLoggedIn && !showMoreExplore && (
                        <SidebarItem 
                            icon={ChevronDown} 
                            label="Show more" 
                            onClick={() => setShowMoreExplore(true)} 
                        />
                    )}

                    {(!isLoggedIn || showMoreExplore) && (
                        <>
                            <SidebarItem icon={Radio} label="Live" />
                            <SidebarItem icon={Gamepad2} label="Gaming" />
                            <SidebarItem icon={Newspaper} label="News" />
                            <SidebarItem icon={Trophy} label="Sport" />
                            <SidebarItem icon={GraduationCap} label="Courses" />
                            <SidebarItem icon={Shirt} label="Fashion & beauty" />
                            <SidebarItem icon={Podcast} label="Podcasts" />
                            <SidebarItem icon={Gamepad} label="Playables" />
                        </>
                    )}

                    {(!isLoggedIn) && (
                        <SidebarItem icon={ChevronUp} label="Show fewer" />
                    )}
                </div>

                {/* More from YouTube */}
                <div className="py-3 border-b border-black/10 dark:border-white/10">
                    <h3 className="text-[16px] font-medium px-3 py-1.5 mb-1">More from YouTube</h3>
                    <SidebarItem icon={Youtube} label="YouTube Premium" colorIcon="text-red-500" />
                    <SidebarItem icon={Music} label="YouTube Music" colorIcon="text-red-500" />
                    <SidebarItem icon={Smile} label="YouTube Kids" colorIcon="text-red-500" />
                </div>

                {/* Report Section */}
                <div className="py-3 border-b border-black/10 dark:border-white/10">
                    <SidebarItem icon={Flag} label="Report history" />
                </div>

                {/* Footer Links */}
                <div className="px-5 py-4 text-[13px] font-medium text-[#606060] dark:text-[#aaaaaa] flex flex-col gap-3">
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">About</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Press</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Copyright</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Contact us</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Creator</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Advertise</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Developers</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Terms</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Privacy</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Policy & Safety</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">How YouTube works</span>
                        <span className="cursor-pointer dark:hover:text-[#f1f1f1]">Test new features</span>
                    </div>

                    <div className="text-[12px] font-normal text-[#909090] dark:text-[#717171] mt-2">
                        © 2026 Google LLC
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
