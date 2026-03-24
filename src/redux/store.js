import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videoReducer from './slices/videoSlice';
import channelReducer from './slices/channelSlice';
import commentReducer from './slices/commentSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        channel: channelReducer,
        comment: commentReducer,
        theme: themeReducer
    }
});
