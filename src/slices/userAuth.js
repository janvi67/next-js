import { createSlice } from "@reduxjs/toolkit";

const userAuthSlice = createSlice({
  name: "userAuthSlice",
  initialState: {
    user: null,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});
const { actions, reducer } = userAuthSlice;
export const { login, logout } = actions;
export default reducer;
