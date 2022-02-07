import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: null,
    isLoading: true,
    error: null
  },
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
  },
  usersReceved: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
  },
  usersRequestFiled: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
  }
  }
});

const { reducer: usersReducer, actions } = usersSlice;
const { usersRequested, usersReceved, usersRequestFiled } = actions;

export const loadUsersList = () => async (dispatch, getState) => {
      dispatch(usersRequested());
      try {
          const { content } = await userService.get();
          dispatch(usersReceved(content));
      } catch (error) {
          dispatch(usersRequestFiled(error.message));
      }
};

export default usersReducer;
