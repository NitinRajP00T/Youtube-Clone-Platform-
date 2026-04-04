import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { videoAPI, commentAPI } from "../services/api";
import VideoCard from "../components/common/VideoCard";
import Skeleton from "@mui/material/Skeleton";

dayjs.extend(relativeTime);

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Fetch main video
        const vidRes = await videoAPI.getById(videoId);
        // console.log("video url by the videopage", vidRes.data.video);
        // setVideo(vidRes.data.data.video);
        // console.log("video api rought data", vidRes.data.data.video.videoUrl);
        setVideo(vidRes.data.data.video);
        console.log("video url by the videopage", vidRes.data.data.video);

        // Fetch comments
        const commRes = await commentAPI.getByVideoNested(videoId);
        setComments(commRes.data.data.comments);

        // Fetch suggested videos purely as placeholder
        const allVidRes = await videoAPI.getAll({ limit: 5 });
        setSuggestedVideos(
          allVidRes.data.data.videos.filter((v) => v._id !== videoId),
        );
      } catch (error) {
        console.error("Failed to fetch video data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [videoId]);

  const handleLike = async () => {
    if (!isAuthenticated) return alert("Please sign in to like");
    try {
      const res = await videoAPI.like(videoId);
      setVideo({
        ...video,
        likesCount: res.data.data.likesCount,
        dislikesCount: res.data.data.dislikesCount,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) return alert("Please sign in to dislike");
    try {
      const res = await videoAPI.dislike(videoId);
      setVideo({
        ...video,
        likesCount: res.data.data.likesCount,
        dislikesCount: res.data.data.dislikesCount,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    try {
      const res = await commentAPI.add({ video: videoId, text: newComment });
      setComments([res.data.data.comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-white max-w-[1700px] mx-auto pt-6 px-4 lg:px-8 flex flex-col lg:flex-row gap-6 pb-20">
        <div className="flex-1 w-full lg:max-w-[calc(100%-400px)]">
          {/* Player Skeleton */}
          <Skeleton
            variant="rectangular"
            width="100%"
            className="aspect-video"
            sx={{ bgcolor: "grey.800", borderRadius: "12px" }}
          />

          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            width="70%"
            sx={{ fontSize: "1.5rem", bgcolor: "grey.800", mt: 2 }}
          />
          <Skeleton
            variant="text"
            width="40%"
            sx={{ fontSize: "1.5rem", bgcolor: "grey.800" }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4">
            <div className="flex items-center gap-4">
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ bgcolor: "grey.800" }}
              />
              <div>
                <Skeleton
                  variant="text"
                  width={120}
                  sx={{ fontSize: "1rem", bgcolor: "grey.800" }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  sx={{ fontSize: "0.75rem", bgcolor: "grey.800" }}
                />
              </div>
              <Skeleton
                variant="rectangular"
                width={90}
                height={36}
                sx={{ bgcolor: "grey.800", borderRadius: "9999px", ml: 2 }}
              />
            </div>
            <div className="flex items-center">
              <Skeleton
                variant="rectangular"
                width={120}
                height={36}
                sx={{ bgcolor: "grey.800", borderRadius: "9999px" }}
              />
            </div>
          </div>
        </div>

        {/* Suggested Videos Skeleton */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="flex flex-col gap-3">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="flex gap-2 p-2">
                <Skeleton
                  variant="rectangular"
                  width={160}
                  className="aspect-video flex-shrink-0"
                  sx={{ bgcolor: "grey.800", borderRadius: "8px" }}
                />
                <div className="flex flex-col w-full">
                  <Skeleton
                    variant="text"
                    width="90%"
                    sx={{ fontSize: "0.875rem", bgcolor: "grey.800" }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{ fontSize: "0.875rem", bgcolor: "grey.800", mt: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!video)
    return <div className="text-white text-center mt-20">Video not found</div>;

  return (
    <div className="text-white max-w-[1700px] mx-auto pt-6 px-4 lg:px-8 flex flex-col lg:flex-row gap-6 pb-20">
      <div className="flex-1 w-full lg:max-w-[calc(100%-400px)]">
        {/* Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full outline-none"
          />
        </div>

        {/* Video Info */}
        <h1 className="text-xl font-bold mt-4 tracking-tight">{video.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to={`/channel/${video.channel?._id}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-full flex justify-center items-center font-bold">
                {video.channel?.channelName?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight hover:text-blue-400 transition-colors leading-tight">
                  {video.channel?.channelName || "Unknown"}
                </h3>
                <p className="text-xs text-yt-text-second">
                  {video.channel?.subscribers || 0} subscribers
                </p>
              </div>
            </Link>
            <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>

          <div className="flex items-center bg-yt-hover rounded-full">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 hover:bg-yt-border rounded-l-full border-r border-yt-border transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:-translate-y-0.5 transition-transform"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span className="text-sm font-medium">
                {video.likesCount || 0}
              </span>
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center gap-2 px-4 py-2 hover:bg-yt-border rounded-r-full transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 group-hover:translate-y-0.5 transition-transform"
              >
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-yt-hover hover:bg-[#3f3f3f]/40 transition-colors rounded-xl p-3 mt-4 text-sm cursor-pointer">
          <p className="font-medium">
            {video.views} views • {dayjs(video.createdAt).format("MMM D, YYYY")}
          </p>
          <p className="mt-2 text-yt-text whitespace-pre-wrap">
            {video.description}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-6">{comments.length} Comments</h2>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 flex flex-col items-end">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-yt-border focus:border-white outline-none py-1 text-sm transition-colors"
                />
                {newComment && (
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setNewComment("")}
                      className="px-4 py-2 text-sm font-medium rounded-full hover:bg-yt-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium rounded-full bg-blue-500 text-black hover:bg-blue-400 transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-yt-hover rounded-xl text-center">
              <p className="mb-2">Sign in to add a comment</p>
              <Link to="/auth" className="text-blue-400 hover:text-blue-500">
                Sign In
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">
                  {comment.user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm">
                      @{comment.user?.username || "user"}
                    </span>
                    <span className="text-xs text-yt-text-second">
                      {dayjs(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm mt-1 mb-2">{comment.text}</p>
                  <div className="flex gap-4 text-yt-text-second items-center text-xs font-medium cursor-pointer">
                    <div className="hover:text-white transition-colors flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </div>
                    <div className="hover:text-white transition-colors flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                      </svg>
                    </div>
                    <span className="hover:text-white transition-colors ml-2">
                      Reply
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Videos */}
      <div className="w-full lg:w-[400px] flex-shrink-0">
        <div className="flex flex-col gap-3">
          {suggestedVideos.map((vid) => (
            <Link
              key={vid._id}
              to={`/video/${vid._id}`}
              className="flex gap-2 group cursor-pointer hover:bg-yt-hover p-2 rounded-lg transition-colors -mx-2"
            >
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-sm font-medium line-clamp-2 text-yt-text leading-tight group-hover:text-blue-400">
                  {vid.title}
                </h3>
                <div className="text-xs text-yt-text-second mt-1 truncate hover:text-white transition-colors">
                  {vid.channel?.channelName || "Unknown"}
                </div>
                <div className="text-xs text-yt-text-second mt-0.5">
                  {vid.views} views • {dayjs(vid.createdAt).fromNow()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
