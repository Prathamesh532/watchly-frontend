import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/httpService";

const filesSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    loading: false,
    error: "",
    user_avatar: "",
    user_coverImage: "",
  },
  extraReducers: (builder) => {
    // uploadUserAvatarCoverImage
    builder
      .addCase(uploadUserAvatarCoverImage.pending, (files, action) => {
        files.loading = true;
      })
      .addCase(uploadUserAvatarCoverImage.fulfilled, (files, action) => {
        files.loading = false;
        console.log(
          "action.payload uploadUserAvatarCoverImage",
          action.payload
        );
        files.user_avatar = action.payload.data.avatar;
        files.user_coverImage = action.payload.data.coverImage || "";
      })
      .addCase(uploadUserAvatarCoverImage.rejected, (files, action) => {
        files.loading = false;
        files.error = action.payload.error;
      });
  },
});

export const uploadUserAvatarCoverImage = createAsyncThunk(
  "files/uploadUserAvatarCoverImage",
  async (data, thunkAPI) => {
    const url = "/users/avatarCoverImage";
    try {
      // const respose = await fetch(url, {
      //   method: "POST",
      //   body: data,
      // });

      const respone = await API.post(url, data);

      const files = await respone.json();

      return files;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export default filesSlice.reducer;
