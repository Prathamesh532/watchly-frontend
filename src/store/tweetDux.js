import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../utils/httpService";

const tweetSlice = createSlice({
  name: "tweet",
  initialState: {
    userTweets: [],
    allTweets: [],
    tweetsComments: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // postTweet
    builder
      .addCase(postTweet.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postTweet.fulfilled, (state, action) => {
        toast.success("Tweet Post Successfully 😊");
      })
      .addCase(postTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Something Went Wrong!!!");
      });

    // getUserTweets
    builder
      .addCase(getUserTweets.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        console.log("action payload", action.payload);
        state.loading = false;
        state.userTweets = action.payload.data;
      })
      .addCase(getUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // getAllTweets
    builder.addCase(getAllTweets.fulfilled, (state, action) => {
      state.allTweets = action.payload.allTweets;
    });
  },
});

// postTweet
export const postTweet = createAsyncThunk(
  "tweet/postTweet",
  async (data, thunkAPI) => {
    const url = "/tweet";
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

      const tweet = await response.json();

      return tweet;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getUserTweets
export const getUserTweets = createAsyncThunk(
  "tweet/getUserTweets",
  async (_, thunkAPI) => {
    const url = "/tweet/getUserTweets";
    try {
      // const respose = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const response = await API.get(url);

      const usertTweet = await response.json();
      return usertTweet;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getAllTweets
export const getAllTweets = createAsyncThunk(
  "video/getAllVideos",
  async (
    { page = 1, limit = 10, sortBy = "createdAt", sortType = "asc" },
    thunkAPI
  ) => {
    try {
      const url = `/tweet/getTweets?page=${page}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`;

      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const response = await API.get(url);

      const tweet = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(
          tweet.message || "Failed to fetch videos"
        );
      }

      return tweet.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

/* Selectors */
export const UserTweet = () => useSelector((state) => state.tweet.userTweets);
export const AllTweets = () => useSelector((state) => state.tweet.allTweets);

export default tweetSlice.reducer;
