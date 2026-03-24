import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Shorts', path: '#', icon: '⚡' },
    { name: 'Subscriptions', path: '#', icon: '📺' },
];

const Sidebar = () => {
    return (
        <aside className="w-60 bg-white dark:bg-yt-bg hover:overflow-y-auto overflow-hidden hidden md:flex flex-col border-r border-black/5 dark:border-yt-border/50 px-3 py-2 text-black dark:text-white transition-colors">
            {navItems.map((item, index) => (
                <Link key={index} to={item.path} className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-yt-hover transition-colors">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                </Link>
            ))}
            <hr className="border-black/10 dark:border-yt-border my-3 transition-colors" />
            <div className="px-3 py-2 text-gray-800 dark:text-yt-text transition-colors">
                <p className="text-sm mb-2">Sign in to like videos, comment, and subscribe.</p>
                <Link to="/auth" className="inline-flex items-center gap-2 text-[#065fd4] dark:text-[#3ea6ff] border border-gray-200 dark:border-yt-border px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-[#3ea6ff]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span className="font-medium text-sm">Sign in</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
