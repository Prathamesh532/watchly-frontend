import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    customLoading: false,
  },
  reducers: {
    setLoading: (common, action) => {
      common.customLoading = action.payload;
    },
  },
});

export const setCustomLoading = (value) => (dispatch) => {
  dispatch(setLoading(value));
};

export const CustomLoading = () =>
  useSelector((state) => state.common.customLoading);

const { setLoading } = commonSlice.actions;

export default commonSlice.reducer;
