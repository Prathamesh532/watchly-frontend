import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import API from "../utils/httpService";
import { toast } from "react-toastify";

const token = localStorage.getItem("accessToken");

const videoSlice = createSlice({
  name: "video",
  initialState: {
    user_videos: [],
    user_watchHistory: [],
    user_latest_video_uploads: [],
    user_liked_video: [],
    user_playlists: [],
    create_user_playlist: [],
    videoUploadError: "",
    video_user_watch: [],
    allVideos: [],
    user_subscribed_videos: [],
  },
  extraReducers: (builder) => {
    //uploadVideo
    builder
      .addCase(uploadVideo.pending, (video, action) => {})
      .addCase(uploadVideo.fulfilled, (video, action) => {
        video.user_latest_video_uploads.push(action.payload?.data);
      })
      .addCase(uploadVideo.rejected, (video, action) => {
        video.videoUploadError = action.payload?.error;
      });

    //getUserVideos
    builder
      .addCase(getUserVideos.pending, (video, action) => {})
      .addCase(getUserVideos.fulfilled, (video, action) => {
        console.log("action payload", action.payload);

        video.user_videos = action.payload?.data;
      })
      .addCase(getUserVideos.rejected, (video, action) => {
        video.videoUploadError = action.payload?.error;
      });

    // getUserSubscribedVideos
    builder
      .addCase(getUserSubscribedVideos.pending, (video, action) => {})
      .addCase(getUserSubscribedVideos.fulfilled, (state, action) => {
        const { data } = action.payload?.video;

        state.user_subscribed_videos = data; // Use userId as key
      })
      .addCase(getUserSubscribedVideos.rejected, (video, action) => {});

    // videoViewIncrement
    builder
      .addCase(videoViewIncrement.pending, (video, action) => {})
      .addCase(videoViewIncrement.fulfilled, (video, action) => {})
      .addCase(videoViewIncrement.rejected, (video, action) => {});

    // getVideoById
    builder
      .addCase(getVideoById.pending, (video, action) => {})
      .addCase(getVideoById.fulfilled, (video, action) => {
        video.video_user_watch = action.payload?.data;
      })
      .addCase(getVideoById.rejected, (video, action) => {});

    //videoLikeToogle
    builder
      .addCase(videoLikeToogle.pending, (video, action) => {})
      .addCase(videoLikeToogle.fulfilled, (video, action) => {
        const { data } = action.payload;
        const videoId = data.video;
        video.user_liked_video = { ...video.user_liked_video, videoId };
      })
      .addCase(videoLikeToogle.rejected, (video, action) => {});

    //getAllVideos
    builder
      .addCase(getAllVideos.pending, (video, action) => {})
      .addCase(getAllVideos.fulfilled, (video, action) => {
        video.allVideos = action.payload?.data?.allVideo;
      })
      .addCase(getAllVideos.rejected, (video, action) => {});

    // getUserLikedVideos
    builder
      .addCase(getUserLikedVideos.pending, (video, action) => {})
      .addCase(getUserLikedVideos.fulfilled, (video, action) => {
        video.user_liked_video = action.payload?.data.likedVideos;
      })
      .addCase(getUserLikedVideos.rejected, (video, action) => {});

    // createPlaylist
    builder
      .addCase(createPlaylist.pending, (state, action) => {})
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.create_user_playlist = action?.payload;
        state.user_playlists.push(action?.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {});

    // getPlaylist
    builder
      .addCase(getPlaylist.pending, (state, action) => {})
      .addCase(getPlaylist.fulfilled, (state, action) => {
        state.user_playlists = action?.payload;
      })
      .addCase(getPlaylist.rejected, (state, action) => {});

    // isVideoLikedbyUser
    builder
      .addCase(isVideoLikedbyUser.pending, (state, action) => {})
      .addCase(isVideoLikedbyUser.fulfilled, (state, action) => {})
      .addCase(isVideoLikedbyUser.rejected, (state, action) => {});

    // deletePlaylist
    builder
      .addCase(deletePlaylist.pending, (state, action) => {})
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        // remove the deleted playlist from the user_playlists array
        state.user_playlists = state.user_playlists.filter(
          (playlist) => playlist._id !== action?.payload._id
        );
      })
      .addCase(deletePlaylist.rejected, (state, action) => {});

    // updatePlaylistDetails
    builder
      .addCase(updatePlaylistDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlaylistDetails.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        console.log("updated", updated);

        state.user_playlists = state.user_playlists.map((playlist) =>
          playlist._id === updated._id ? updated : playlist
        );
        toast.success("Playlist Updated Successfully");
      })
      .addCase(updatePlaylistDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Something Went Wrong!!!");
      });

    // addVideoToPlaylist
    builder
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        state.user_playlists = state.user_playlists.map((playlist) =>
          playlist._id === updated._id ? updated : playlist
        );
        toast.success("Video Added to Playlist Successfully");
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Something Went Wrong!!!");
      });

    // removeVideoFromPlaylist
    builder
      .addCase(removeVideoFromPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        state.user_playlists = state.user_playlists.map((playlist) =>
          playlist._id === updated._id ? updated : playlist
        );
        toast.success("Video Removed from Playlist Successfully");
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Something Went Wrong!!!");
      });
  },
});

// uploadVideo
export const uploadVideo = createAsyncThunk(
  "video/uploadVideo",
  async (data, thunkAPI) => {
    const url = "/video/upload";
    try {
      const response = await API.post(url, data);
      const video = response.data;
      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getUserVideos
export const getUserVideos = createAsyncThunk(
  "video/getUserVideos",
  async ({ userId }, thunkAPI) => {
    const url = `/video/getUserVideos/${userId}`;
    try {
      const response = await API.get(url);
      const video = response.data;
      console.log("video>>", video);

      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getUserSubscribedVideos
export const getUserSubscribedVideos = createAsyncThunk(
  "video/getUserSubscribedVideos",
  async ({ userId }, thunkAPI) => {
    const url = `/video/getUserVideos/${userId}`;
    try {
      const response = await API.get(url);
      const video = response.data;
      return { video, userId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getVideoById
export const getVideoById = createAsyncThunk(
  "video/getVideoById",
  async ({ videoId }, thunkAPI) => {
    const url = `/video/getVideo/${videoId}`;
    try {
      const response = await API.get(url);
      const video = response.data;
      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// videoViewIncrement
export const videoViewIncrement = createAsyncThunk(
  "video/videoViewIncrement",
  async ({ videoId }, thunkAPI) => {
    const url = `/video/view-increment`;
    try {
      const response = await API.post(url, { videoId });
      const video = response.data;
      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// videoLikeToogle
export const videoLikeToogle = createAsyncThunk(
  "video/videoLikeToogle",
  async ({ videoId }, thunkAPI) => {
    const url = `/like/video/${videoId}`;
    try {
      const response = await API.post(url, { videoId });
      const video = response.data;
      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getAllVideos
export const getAllVideos = createAsyncThunk(
  "video/getAllVideos",
  async (
    { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" },
    thunkAPI
  ) => {
    try {
      const url = `/video/getAllvideo?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`;

      const response = await API.get(url);
      const video = response.data;

      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

// getUserLikedVideos
export const getUserLikedVideos = createAsyncThunk(
  "video/getUserLikedVideos",
  async (_, thunkAPI) => {
    const url = "/like/getLikedVideo";
    try {
      const respose = await API.get(url);
      const video = respose.data;
      return video;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// createPlaylist
export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (data, thunkAPI) => {
    const url = "/playlist/create";
    try {
      const response = await API.get(url);
      const playlist = response.data;
      return playlist.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getPlaylist
export const getPlaylist = createAsyncThunk(
  "playlist/getPlaylist",
  async ({ userId }, thunkAPI) => {
    const url = `/playlist/getUserPlaylist/${userId}`;
    try {
      const response = await API.get(url);
      const playlist = response.data;
      return playlist.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// isVideoLikedbyUser
export const isVideoLikedbyUser = createAsyncThunk(
  "video/isVideoLikedbyUser",
  async ({ videoId }, thunkAPI) => {
    const url = `/like/userLikedVideo/${videoId}`;
    try {
      const response = await API.get(url);
      const isLiked = response.data;
      return isLiked.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// updatePlaylistDetails
export const updatePlaylistDetails = createAsyncThunk(
  "playlist/updateDetails",
  async ({ _id, name, description }, thunkAPI) => {
    try {
      const response = await API.patch("/playlist/updateDetails", {
        _id,
        name,
        description,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// addVideoToPlaylist
export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideo",
  async ({ playlist_id, video_id }, thunkAPI) => {
    try {
      const response = await API.patch("/playlist/addvideo", {
        playlist_id,
        video_id,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// removeVideoFromPlaylist
export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideo",
  async ({ playlist_id, video_id }, thunkAPI) => {
    try {
      const response = await API.patch("/playlist/removevideo", {
        playlist_id,
        video_id,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// deletePlaylist
export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (_id, thunkAPI) => {
    console.log("_id>>", _id);

    const url = `/playlist/remove`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify({ _id: _id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const playlist = await response.data;
      return playlist.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const UserVideos = () => useSelector((state) => state.video.user_videos);
export const UserWatchHistory = () =>
  useSelector((state) => state.video.user_watchHistory);
export const UserLatestVideoUploads = () =>
  useSelector((state) => state.video.user_latest_video_uploads);
export const UserLikedVideo = () =>
  useSelector((state) => state.video.user_liked_video);
export const GetAllVideos = () => useSelector((state) => state.video.allVideos);
export const UserSubscribedVideos = () =>
  useSelector((state) => state.video.user_subscribed_videos);
export const UserPlaylists = () =>
  useSelector((state) => state.video.user_playlists);

export default videoSlice.reducer;
