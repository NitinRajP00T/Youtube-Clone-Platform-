import { createSlice } from '@reduxjs/toolkit';

const channelSlice = createSlice({
    name: 'channel',
    initialState: {
        currentChannel: null,
        loading: false,
        error: null
    },
    reducers: {
        setChannelData: (state, action) => {
            state.currentChannel = action.payload;
            state.loading = false;
            state.error = null;
        },
        setChannelLoading: (state) => {
            state.loading = true;
        },
        setChannelError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setChannelData, setChannelLoading, setChannelError } = channelSlice.actions;
export default channelSlice.reducer;
