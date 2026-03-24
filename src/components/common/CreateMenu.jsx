import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Radio, SquarePen } from 'lucide-react';

const CreateMenu = () => {
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

    const MenuItem = ({ icon: Icon, label, link }) => (
        <Link 
            to={link}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 px-4 py-2.5 hover:bg-black/5 dark:hover:bg-yt-hover transition-colors cursor-pointer"
        >
            <Icon size={20} className="text-gray-600 dark:text-yt-text" />
            <span className="text-[14px] text-gray-800 dark:text-yt-text whitespace-nowrap">{label}</span>
        </Link>
    );

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-yt-hover rounded-full transition-colors bg-gray-100 dark:bg-[#272727]"
            >
                <Plus size={20} className="text-gray-800 dark:text-yt-text" />
                <span className="text-[14px] font-medium text-gray-800 dark:text-yt-text hidden sm:block">Create</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-max bg-white dark:bg-[#282828] rounded-xl shadow-[0_4px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_32px_0_rgba(0,0,0,0.6)] py-2 border border-black/10 dark:border-yt-border/40 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <MenuItem icon={Upload} label="Upload video" link="/upload" />
                    <MenuItem icon={Radio} label="Go live" link="#" />
                    <MenuItem icon={SquarePen} label="Create post" link="#" />
                </div>
            )}
        </div>
    );
};

export default CreateMenu;
