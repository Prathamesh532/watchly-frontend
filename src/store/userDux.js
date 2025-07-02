import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import API from "../utils/httpService";

const token = localStorage.getItem("accessToken");

const userSlice = createSlice({
  name: "user",
  initialState: {
    user_data: {},
    user_channel_data: {},
    user_watchHistory: [],
    loading: false,
    isUserLogin: false,
    loginError: "",
    registerError: "",
    error: "",
    accessToken: "",
    refreshToken: "",
    users: [],
    user_subscriptions: [],
  },
  extraReducers: (builder) => {
    // userRegisterD
    builder
      .addCase(userRegister.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(userRegister.fulfilled, (user, action) => {
        user.loading = false;
        user.isUserLogin = true;
        user.user_data = action.payload.data;
        if (!action.payload.error)
          toast.success("User Resgiter Successfully!!!");
      })
      .addCase(userRegister.rejected, (user, action) => {
        user.loading = false;
        user.isUserLogin = false;
        user.registerError = action.payload.error;
        if (action.payload.error) toast.error("Error While Regsitring User :(");
      });

    // userLogin
    builder
      .addCase(userLogin.pending, (user, action) => {
        user.loading = true;
        user.isUserLogin = false;
      })
      .addCase(userLogin.fulfilled, (user, action) => {
        user.loading = false;
        user.isUserLogin = true;
        user.user_data = action.payload?.data?.userData || {};
        user.accessToken = action.payload?.data?.accessToken || "";
        user.refreshToken = action.payload?.data?.refreshToken || "";
        localStorage.setItem("accessToken", user.accessToken);
        localStorage.setItem("refreshToken", user.refreshToken);
        if (!action.payload.error) toast.success("Login Successfull");
      })
      .addCase(userLogin.rejected, (user, action) => {
        console.log("action.payload", action.payload);
        console.log("action.payload", action.payload.error);

        user.loading = false;
        user.isUserLogin = false;
        user.loginError = action.payload.error;
        if (action.payload.error) toast.error(user.loginError);
      });

    // userLogout
    builder
      .addCase(userLogout.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(userLogout.fulfilled, (user, action) => {
        user.loading = false;
        user.isUserLogin = false;
        user.user_data = {};
        user.accessToken = "";
        toast.info("User has Logout");
      })
      .addCase(userLogout.rejected, (user, action) => {
        user.loading = false;
        toast.error("Error while Logout");
      });

    // updateUserDetails
    builder
      .addCase(updateUserDetails.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (user, action) => {
        user.loading = false;
        user.user_data = action.payload.data
          ? action.payload.data
          : user.user_data;
      })
      .addCase(updateUserDetails.rejected, (user, action) => {
        user.loading = false;
        user.loginError = action.payload.error;
      });

    // updateAvatar
    builder
      .addCase(updateAvatar.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (user, action) => {
        user.loading = false;
        const { avatar } = action.payload.data;
        user.user_data.avatar = avatar;
      })
      .addCase(updateAvatar.rejected, (user, action) => {
        user.loading = false;
        user.loginError = action.payload.error;
      });

    // updateCoverImage
    builder
      .addCase(updateCoverImage.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(updateCoverImage.fulfilled, (user, action) => {
        user.loading = false;
        const { coverImage } = action.payload.data;
        user.user_data.coverImage = coverImage;
      })
      .addCase(updateCoverImage.rejected, (user, action) => {
        user.loading = false;
        user.loginError = action.payload.error;
      });

    // updateAccessToken
    builder
      .addCase(updateAccessToken.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(updateAccessToken.fulfilled, (user, action) => {
        const { accessToken, newRefreshToken } = action.payload;
        user.loading = false;
        user.user_data.accessToken = accessToken;
        localStorage.setItem("accessToken", accessToken);
        user.user_data.refreshToken = newRefreshToken;
        localStorage.setItem("refreshToken", newRefreshToken);
      })
      .addCase(updateAccessToken.rejected, (user, action) => {
        user.loading = false;
        user.error = action.payload;
      });

    // changePassword
    builder
      .addCase(changePassword.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(changePassword.fulfilled, (user, action) => {
        user.loading = false;
        toast.success("Password Changed Successfully");
      })
      .addCase(changePassword.rejected, (user, action) => {
        user.loading = false;
        user.error = action.payload;
      });

    // getUserChannelDetails
    builder
      .addCase(getUserChannelDetails.pending, (user, action) => {
        user.loading = true;
      })
      .addCase(getUserChannelDetails.fulfilled, (user, action) => {
        user.loading = false;
        user.user_channel_data = action.payload?.data;
      })
      .addCase(getUserChannelDetails.rejected, (user, action) => {
        user.loading = false;
        user.error = action.payload?.error;
      });

    // getUserById // TODO:::
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.users) state.users = []; // Ensure users array is initialized
        state.users.push(action.payload?.data);
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });

    // channelSubscribeToggle
    builder
      .addCase(channelSubscribeToggle.pending, (state) => {
        state.loading = true;
      })
      .addCase(channelSubscribeToggle.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        state.user_subscriptions = { ...state.user_subscriptions, data };
      })
      .addCase(channelSubscribeToggle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });

    // getSubscribedChannels
    builder
      .addCase(getSubscribedChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        state.user_subscriptions = data;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });

    // getUserWatchHistory
    builder
      .addCase(getUserWatchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        state.user_watchHistory = data;
      })
      .addCase(getUserWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  },
});

// userRegister
export const userRegister = createAsyncThunk(
  "user/userRegister",
  async (data, thunkAPI) => {
    const url = "/users/register";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      // const user = await respose.json();

      const response = await API.post(url, data);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// userLogin
export const userLogin = createAsyncThunk(
  "user/userLogin",
  async (data, thunkAPI) => {
    const url = "/users/login";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   credentials: "include",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });

      // const user = await respose.json();

      const user = await API.post(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// user logout
export const userLogout = createAsyncThunk(
  "user/userLogout",
  async (data, thunkAPI) => {
    const url = "/users/logout";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`, // Attach token in header
      //   },
      //   body: JSON.stringify(data),
      // });

      // const user = await respose.json();

      const user = await API.post(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// updateUserDetails
export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (data, thunkAPI) => {
    const url = "/users/userUpdate";
    try {
      // const respose = await fetch(url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(data),
      // });
      // const user = await respose.json();

      const user = await API.put(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// updateAvatar
export const updateAvatar = createAsyncThunk(
  "usert/updateAvatar",
  async (data, thunkAPI) => {
    const url = "/users/updateAvatar";
    try {
      // const respose = await fetch(url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: data,
      // });
      // const user = await respose.json();

      const user = await API.put(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// updateCoverImage
export const updateCoverImage = createAsyncThunk(
  "user/updateCoverImage",
  async (data, thunkAPI) => {
    const url = "/users/updateCoverImage";
    try {
      // const respose = await fetch(url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: data,
      // });
      // const user = await respose.json();

      const user = await API.put(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// updateAccessToken
export const updateAccessToken = createAsyncThunk(
  "user/updateAccessToken",
  async (data, thunkAPI) => {
    const url = "/users/refreshAccessToken";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   data: JSON.stringify(data),
      // });

      // const refreshToken = await respose.json();

      const refreshToken = await API.post(url, data);

      return refreshToken;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// changePassword
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data, thunkAPI) => {
    const url = "/users/changepassword";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(data),
      // });

      // const user = await respose.json();

      const user = await API.post(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getUserChannelDetails
export const getUserChannelDetails = createAsyncThunk(
  "user/getUserChannelDetails",
  async ({ username }, thunkAPI) => {
    const url = `/users/userProfile/${username}`;
    try {
      // const respose = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // const user = await respose.json();

      const user = await API.get(url);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getUserById
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async ({ userId }, thunkAPI) => {
    const url = `/users/user/${userId}`;
    try {
      // const respose = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // const user = await respose.json();

      const user = await API.get(url);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// channelSubscribeToogle
export const channelSubscribeToggle = createAsyncThunk(
  "user/channelSubscribeToggle",
  async (data, thunkAPI) => {
    const url = `/subscribe/`;
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(data),
      // });

      // const user = await respose.json();

      const user = await API.post(url, data);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getSubscribedChannels
export const getSubscribedChannels = createAsyncThunk(
  "user/getSubscribedChannels",
  async ({ subscriberId }, thunkAPI) => {
    const url = `/subscribe/getSubscribedChannels/${subscriberId}`;
    try {
      // const respose = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // const user = await respose.json();

      const user = await API.get(url);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// getUserWatchHistory
export const getUserWatchHistory = createAsyncThunk(
  "user/userWatchHistory",
  async (data, thunkAPI) => {
    const url = `/users/userWatchHistory`;
    try {
      // const respose = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // const user = await respose.json();

      const user = await API.get(url);

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

/* selectors */

export const UserDetail = () => useSelector((state) => state.user.user_data);
export const UserToken = () => useSelector((state) => state.user.accessToken);
export const UserChannelProfile = () =>
  useSelector((state) => state.user.user_channel_data);
export const UserSubscribedChannels = () =>
  useSelector((state) => state.user.user_subscriptions);

export default userSlice.reducer;
