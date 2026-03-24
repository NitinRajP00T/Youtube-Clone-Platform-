import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, fetchSuccess, fetchFailure, setFilters } from '../redux/slices/videoSlice';
import { videoAPI } from '../services/api';
import VideoCard from '../components/common/VideoCard';
import SkeletonVideoCard from '../components/common/SkeletonVideoCard';

const categories = ['All', 'Music', 'Gaming', 'News', 'Live', 'Education', 'Sports'];

const HomePage = () => {
    const dispatch = useDispatch();
    const { videos, loading, error, filters } = useSelector(state => state.video);

    useEffect(() => {
        const loadVideos = async () => {
            dispatch(fetchStart());
            try {
                const res = await videoAPI.getAll({ category: filters.category, search: filters.search });
                dispatch(fetchSuccess(res.data.data.videos));
            } catch (err) {
                dispatch(fetchFailure(err.response?.data?.message || 'Failed to fetch videos'));
            }
        };

        loadVideos();
    }, [dispatch, filters.category, filters.search]);

    return (
        <div className="flex flex-col h-full">
            {/* Category Filters */}
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar sticky top-0 bg-white dark:bg-yt-bg z-10 py-2 transition-colors border-b border-black/5 dark:border-transparent">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => dispatch(setFilters({ category: cat }))}
                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                            filters.category === cat 
                                ? 'bg-black text-white dark:bg-white dark:text-black font-medium' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-yt-hover dark:hover:bg-yt-border dark:text-yt-text'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Video Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 mt-4 pb-10">
                    {[...Array(8)].map((_, index) => (
                        <SkeletonVideoCard key={index} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 p-4 text-center border border-red-500/30 rounded bg-red-500/10">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 mt-4 pb-10">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                    {videos.length === 0 && (
                        <div className="col-span-full text-center text-gray-600 dark:text-yt-text-second py-10 transition-colors">
                            No videos found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
