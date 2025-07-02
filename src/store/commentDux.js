import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import API from "../utils/httpService";

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    videoComments: {},
    userVideoComment: [],
    videoCommentError: "",
  },
  extraReducers: (builder) => {
    // addVideoComment
    builder
      .addCase(addVideoComment.pending, (comment, action) => {})
      .addCase(addVideoComment.fulfilled, (comment, action) => {
        const { data } = action.payload;
        const videoId = data.video;

        // Initialize videoComments if it doesn't exist
        if (!comment.videoComments) {
          comment.videoComments = {};
        }

        // Initialize the array for this video if it doesn't exist
        if (!comment.videoComments[videoId]) {
          comment.videoComments[videoId] = [];
        }

        // Add the new comment while maintaining immutability
        comment.videoComments[videoId] = [
          ...comment.videoComments[videoId],
          data,
        ];
      })
      .addCase(addVideoComment.rejected, (comment, action) => {
        comment.videoCommentError = action.payload?.error;
      });

    // getVideoComments
    builder
      .addCase(getVideoComments.pending, (comment, action) => {})
      .addCase(getVideoComments.fulfilled, (comment, action) => {
        const { videoId, data } = action.payload;

        comment.videoComments = {
          ...comment.videoComments,
          [videoId]: data,
        };
      })
      .addCase(getVideoComments.rejected, (comment, action) => {
        comment.videoCommentError = action.payload?.error;
      });

    // deleteVideoComment
    builder
      .addCase(deleteVideoComment.pending, (state, action) => {})
      .addCase(deleteVideoComment.fulfilled, (state, action) => {
        const { comment_id, comments } = action.payload;
        const videoId = comments.data.video;

        // Check if videoComments exists and is an object
        if (state.videoComments && typeof state.videoComments === "object") {
          // Use optional chaining to safely check if comments for this video exist
          const currentVideoComments = state.videoComments[videoId];

          if (Array.isArray(currentVideoComments)) {
            state.videoComments = {
              ...state.videoComments,
              [videoId]: currentVideoComments.filter(
                (c) => c._id !== comment_id
              ),
            };
          } else {
            console.log("No comments found for this video");
          }
        } else {
          console.log("videoComments is not an object");
        }
      })
      .addCase(deleteVideoComment.rejected, (state, action) => {
        console.error("Delete comment failed:", action.error);
      });

    //updateVideoComment
    builder
      .addCase(updateVideoComment.pending, (state, action) => {})
      .addCase(updateVideoComment.fulfilled, (state, action) => {
        const videoId = action.payload.data.video;

        if (state.videoComments && typeof state.videoComments === "object") {
          state.videoComments = {
            ...state.videoComments,
            [videoId]: state.videoComments[videoId].map((comment) => {
              if (comment._id === action.payload.data._id) {
                return action.payload.data;
              }
              return comment;
            }),
          };
        } else {
          console.log("videoComments is not an object");
        }
      })
      .addCase(updateVideoComment.rejected, (state, action) => {});
  },
});

// addVideoComment
export const addVideoComment = createAsyncThunk(
  "comment/addVideoComment",
  async (data, thunkAPI) => {
    const url = "/comment";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(data),
      // });

      const response = await API.post(url, data);

      const comment = await response.json();
      return comment;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getVideoComments
export const getVideoComments = createAsyncThunk(
  "comment/getVideoComments",
  async ({ videoId }, thunkAPI) => {
    const url = `/comment/getVideoComment/${videoId}`;
    try {
      // const respose = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const response = await API.get(url);

      const comments = await response.json();
      return { videoId, data: comments.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// deleteVideoComment
export const deleteVideoComment = createAsyncThunk(
  "comment/deleteVideoComment",
  async ({ comment_id }, thunkAPI) => {
    const url = `/comment/deleteComment/${comment_id}`;
    try {
      // const respose = await fetch(url, {
      //   method: "DELETE",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const response = await API.delete(url);

      const comments = await response.json();
      return { comment_id, comments };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// updateVideoComment
export const updateVideoComment = createAsyncThunk(
  "comment/updateVideoComment",
  async (data, thunkAPI) => {
    const url = `/comment/updateComment`;
    try {
      // const respose = await fetch(url, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(data),
      // });

      const respone = await API.patch(url, data);

      const comments = await respone.json();
      return comments;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

/* selectors */
export const videoComment = (videoID) =>
  useSelector((state) => state.comment.videoComments[videoID] || []);

export default commentSlice.reducer;
