import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { videoAPI } from "../services/api";
import axiosInstance from "../services/axiosInstance";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("All");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userId } = useSelector((state) => state.auth);

  if (!user?.channel) {
    return (
      <div className="text-white text-center mt-20">
        You need to create a channel first to upload videos!
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile || !title)
      return alert("Please fill required fields");
    setUploading(true);

    try {
      // Upload Video to S3
      const videoData = new FormData();
      videoData.append("file", videoFile);
      const videoUploadRes = await axiosInstance.post("/upload", videoData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Upload Thumbnail to S3
      const thumbData = new FormData();
      thumbData.append("file", thumbnailFile);
      const thumbUploadRes = await axiosInstance.post("/upload", thumbData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Create Video Document
      await videoAPI.upload({
        title,
        description,
        category,
        videoUrl: videoUploadRes.data.data.url,
        thumbnailUrl: thumbUploadRes.data.data.url,
      });

      // navigate(`/channel/${user.channel}`);
      console.log("user id by the upload page ", userId);
      navigate(`/channel/${userId}`);
    } catch (error) {
      console.error("Upload failed", error);
      alert(
        "Upload failed: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-white max-w-2xl mx-auto pt-10 px-4 pb-20">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
      <form
        onSubmit={handleUpload}
        className="flex flex-col gap-5 bg-[#212121] p-8 rounded-xl border border-yt-border shadow-2xl"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5 text-yt-text-second">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#121212] border border-yt-border p-3 rounded-lg focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-yt-text-second">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-[#121212] border border-yt-border p-3 rounded-lg focus:border-blue-500 outline-none transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-yt-text-second">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#121212] border border-yt-border p-3 rounded-lg focus:border-blue-500 outline-none transition-colors"
          >
            <option value="All">All</option>
            <option value="Music">Music</option>
            <option value="Gaming">Gaming</option>
            <option value="Education">Education</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-second">
              Video File * (.mp4)
            </label>
            <div className="border border-dashed border-yt-border p-4 rounded-lg bg-[#121212] hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
                className="w-full text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-second">
              Thumbnail * (.jpg, .png)
            </label>
            <div className="border border-dashed border-yt-border p-4 rounded-lg bg-[#121212] hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                required
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-300 text-white font-bold py-3 px-6 rounded-full mt-4 transition-colors flex justify-center items-center"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>{" "}
              Uploading to AWS S3...
            </>
          ) : (
            "Upload Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
