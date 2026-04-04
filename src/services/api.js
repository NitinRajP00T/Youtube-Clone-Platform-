import axiosInstance from "./axiosInstance";

export const authAPI = {
  login: (data) => axiosInstance.post("/auth/login", data),

  register: (data) => axiosInstance.post("/auth/register", data),
  getMe: () => axiosInstance.get("/auth/me"),
};

export const videoAPI = {
  getAll: (params) => axiosInstance.get("/videos", { params }),
  getById: (id) => axiosInstance.get(`/videos/${id}`),
  like: (id) => axiosInstance.post(`/videos/${id}/like`),
  dislike: (id) => axiosInstance.post(`/videos/${id}/dislike`),
  upload: (data) => axiosInstance.post("/videos", data),
};

export const channelAPI = {
  create: (data) => axiosInstance.post("/channels", data),
  getById: (id) => axiosInstance.get(`/channels/${id}`),
  getByUserId: (userId) => axiosInstance.get(`/channels/user/${userId}`),
  update: (id, data) => axiosInstance.put(`/channels/${id}`, data),
};

export const commentAPI = {
  getByVideo: (videoId, params) =>
    axiosInstance.get(`/comments`, { params: { ...params, videoId } }), // Actually wait, the route is /api/videos/:videoId/comments or /api/comments?videoId=... Let me use the video nested route
  getByVideoNested: (videoId, params) =>
    axiosInstance.get(`/videos/${videoId}/comments`, { params }),
  add: (data) => axiosInstance.post(`/comments`, data),
  delete: (commentId) => axiosInstance.delete(`/comments/${commentId}`),
};
