import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const VideoCard = ({ video }) => {
    if (!video) return null;
    return (
        <Link to={`/video/${video._id}`} className="flex flex-col gap-3 group cursor-pointer">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img 
                    src={video.thumbnailUrl || 'https://via.placeholder.com/640x360?text=No+Thumbnail'} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>
            <div className="flex gap-3 pr-6">
                <div className="min-w-9 min-h-9 max-w-9 max-h-9 rounded-full bg-gray-600 overflow-hidden mt-1 flex items-center justify-center text-xs">
                    {/* Channel Avatar Placeholder */}
                    {video.channel?.channelName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base font-medium line-clamp-2 text-yt-text leading-tight group-hover:text-blue-400 transition-colors">
                        {video.title}
                    </h3>
                    <div className="text-sm text-yt-text-second mt-1 hover:text-white transition-colors">
                        {video.channel?.channelName || 'Unknown Channel'}
                    </div>
                    <div className="text-sm text-yt-text-second">
                        {video.views || 0} views • {dayjs(video.createdAt).fromNow()}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
