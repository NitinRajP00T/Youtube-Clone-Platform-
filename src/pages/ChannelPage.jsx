import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { channelAPI, videoAPI } from '../services/api';
import VideoCard from '../components/common/VideoCard';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';

const ChannelPage = () => {
    const { channelId } = useParams();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                if (channelId === 'create') return setLoading(false);
                
                const res = await channelAPI.getById(channelId);
                setChannel(res.data.data.channel);

                const vidRes = await videoAPI.getAll({ limit: 100 });
                setVideos(vidRes.data.data.videos.filter(v => v.channel?._id === channelId));

            } catch (error) {
                console.error('Failed fetching channel', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChannel();
    }, [channelId]);

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        try {
            const name = e.target.channelName.value;
            const desc = e.target.description.value;
            const res = await channelAPI.create({ channelName: name, description: desc });
            
            // We need to fetch the updated user object because they now have a channel
            const userStr = localStorage.getItem('token'); 
            // Better yet, redirect completely or update Redux. A full reload is easiest and safest.
            window.location.href = `/channel/${res.data.data.channel._id}`;
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create channel');
        }
    };

    if (loading) return <div className="text-white flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div></div>;

    if (channelId === 'create') {
        return (
            <div className="text-white max-w-lg mx-auto pt-20 px-4">
                <h1 className="text-3xl font-bold mb-6">Create Your Channel</h1>
                <form onSubmit={handleCreateChannel} className="flex flex-col gap-4 bg-[#212121] p-6 rounded-xl border border-yt-border shadow-xl">
                    <input name="channelName" placeholder="Channel Name *" required className="bg-[#121212] border border-yt-border p-3 rounded-md focus:border-blue-500 outline-none transition-colors" />
                    <textarea name="description" placeholder="Channel Description" rows="3" className="bg-[#121212] border border-yt-border p-3 rounded-md focus:border-blue-500 outline-none transition-colors"></textarea>
                    <button type="submit" className="bg-white text-black font-medium py-3 rounded-full mt-2 hover:bg-gray-200 transition-colors">Create Channel</button>
                </form>
            </div>
        );
    }

    if (!channel) return <div className="text-white text-center mt-20">Channel not found</div>;

    return (
        <div className="text-white w-full max-w-[1280px] mx-auto pb-20">
            {/* Banner */}
            <div className="w-full h-32 md:h-48 md:h-56 bg-gradient-to-r from-purple-800 to-blue-600 md:rounded-xl md:mt-4 mx-auto overflow-hidden relative w-full sm:max-w-[calc(100%-32px)]">
                {channel.banner && <img src={channel.banner} className="w-full h-full object-cover" alt="banner" />}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-6 px-4 md:px-8 pb-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-700 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0">
                    {channel.channelName?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col items-center sm:items-start mt-2">
                    <h1 className="text-3xl font-bold tracking-tight">{channel.channelName}</h1>
                    <div className="flex flex-wrap gap-2 text-yt-text-second mt-1.5 items-center justify-center sm:justify-start">
                        <span className="font-medium text-white">@{channel.owner?.username || 'user'}</span>
                        <span>•</span>
                        <span>{channel.subscribers} subscribers</span>
                        <span>•</span>
                        <span>{videos.length} videos</span>
                    </div>
                    <p className="mt-3 text-yt-text-second max-w-xl text-center sm:text-left text-sm leading-relaxed line-clamp-2">
                        {channel.description || 'Welcome to my channel!'}
                    </p>
                    <button className="bg-white text-black font-medium px-5 py-2.5 rounded-full mt-4 flex items-center gap-2 hover:bg-gray-200 transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>

            {/* Nav */}
            <div className="border-b border-yt-border px-8 flex gap-8">
                <div className="pb-3 border-b-2 border-white font-medium cursor-pointer">Videos</div>
                <div className="pb-3 text-yt-text-second font-medium cursor-pointer hover:text-white transition-colors">Playlists</div>
                <div className="pb-3 text-yt-text-second font-medium cursor-pointer hover:text-white transition-colors">Community</div>
                <div className="pb-3 text-yt-text-second font-medium cursor-pointer hover:text-white transition-colors">About</div>
            </div>

            {/* Videos Grid */}
            <div className="px-4 md:px-8 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
                    {videos.map(vid => (
                        <VideoCard key={vid._id} video={vid} />
                    ))}
                    {videos.length === 0 && (
                        <div className="col-span-full py-10 text-yt-text-second text-center text-sm">This channel has no videos.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChannelPage;
