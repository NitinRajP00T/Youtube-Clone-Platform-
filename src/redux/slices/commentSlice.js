import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
        loading: false,
        error: null
    },
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
            state.loading = false;
            state.error = null;
        },
        addCommentLocally: (state, action) => {
            state.comments.unshift(action.payload);
        },
        setCommentsLoading: (state) => {
            state.loading = true;
        },
        setCommentsError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setComments, addCommentLocally, setCommentsLoading, setCommentsError } = commentSlice.actions;
export default commentSlice.reducer;
