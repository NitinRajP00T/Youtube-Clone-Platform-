import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
    name: 'video',
    initialState: {
        videos: [],
        currentVideo: null,
        loading: false,
        error: null,
        filters: {
            search: '',
            category: 'All'
        }
    },
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.videos = action.payload;
        },
        fetchFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        }
    }
});

export const { fetchStart, fetchSuccess, fetchFailure, setCurrentVideo, setFilters } = videoSlice.actions;
export default videoSlice.reducer;
