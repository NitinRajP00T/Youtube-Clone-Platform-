import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className={`flex items-center gap-4 px-4 py-2 hover:bg-yt-hover dark:hover:bg-yt-hover transition-colors w-full text-left ${className}`}
        >
            {theme === 'dark' ? (
                <Moon size={20} className="text-yt-text" />
            ) : (
                <Sun size={20} className="text-yt-text" />
            )}
            <span className="text-sm font-medium">Appearance: {theme === 'dark' ? 'Dark theme' : 'Light theme'}</span>
            <svg 
                className="ml-auto" 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    );
};

export default ThemeToggle;
