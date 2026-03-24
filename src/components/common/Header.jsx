import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../redux/slices/videoSlice';
import ProfileMenu from './ProfileMenu';
import CreateMenu from './CreateMenu';
import { Bell, Search, Mic } from 'lucide-react';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    navigate('/');
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white dark:bg-yt-bg sticky top-0 z-50 border-b border-black/5 dark:border-yt-border/50 text-black dark:text-white transition-colors">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-black/5 dark:hover:bg-yt-hover rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <Link to="/" className="text-xl font-bold flex items-center gap-1 group">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-lg text-sm group-hover:bg-red-500 transition-colors">►</span>
          <span className="tracking-tighter font-['Oswald'] dark:text-white">TubeClone</span>
        </Link>
      </div>
      
      <div className="flex-1 flex justify-center px-8 gap-4">
        <form className="flex w-full max-w-[600px] items-center" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-gray-300 dark:border-yt-border px-4 py-2 rounded-l-full focus:outline-none focus:border-blue-500 shadow-inner dark:shadow-none transition-colors"
          />
          <button type="submit" className="bg-gray-100 dark:bg-yt-hover border border-l-0 border-gray-300 dark:border-yt-border px-5 py-2 rounded-r-full hover:bg-gray-200 dark:hover:bg-yt-border transition-colors group">
            <Search size={20} className="text-gray-600 dark:text-yt-text-second group-hover:dark:text-white" />
          </button>
        </form>
        <button className="hidden sm:flex bg-gray-100 dark:bg-yt-hover p-2 rounded-full hover:bg-gray-200 dark:hover:bg-yt-border transition-colors items-center justify-center h-10 w-10 shrink-0">
            <Mic size={20} className="text-gray-800 dark:text-white" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
            <>
                <CreateMenu />
                <button className="p-2 hover:bg-black/5 dark:hover:bg-yt-hover rounded-full transition-colors hidden sm:block relative">
                    <Bell size={24} className="text-gray-800 dark:text-white" />
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-yt-bg">9+</span>
                </button>
                <div className="ml-2">
                    <ProfileMenu />
                </div>
            </>
        ) : (
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-black/5 dark:hover:bg-yt-hover rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:text-white"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
                <Link to="/auth" className="flex items-center gap-2 text-[#065fd4] dark:text-[#3ea6ff] border border-gray-200 dark:border-yt-border px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-[#3ea6ff]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span className="font-medium text-sm">Sign in</span>
                </Link>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
