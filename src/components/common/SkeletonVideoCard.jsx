import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const SkeletonVideoCard = () => {
    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Thumbnail Skeleton */}
            <div className="w-full aspect-video rounded-xl overflow-hidden">
                <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%"
                    sx={{ bgcolor: 'grey.800' }}
                />
            </div>
            
            <div className="flex gap-3 pr-[24px]">
                {/* Channel Avatar Skeleton */}
                <div className="mt-1 flex-shrink-0">
                    <Skeleton 
                        variant="circular" 
                        width={36} 
                        height={36} 
                        sx={{ bgcolor: 'grey.800' }}
                    />
                </div>
                
                <div className="flex flex-col w-full gap-[12px] mt-1.5">
                    {/* Title & Detail Skeletons */}
                    <Skeleton variant="rounded" width="90%" height={16} sx={{ bgcolor: 'grey.800', borderRadius: '4px' }} />
                    <Skeleton variant="rounded" width="70%" height={16} sx={{ bgcolor: 'grey.800', borderRadius: '4px' }} />
                </div>
            </div>
        </div>
    );
};

export default SkeletonVideoCard;
