import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    auth: null,
    isLoggedIn: false
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
  },
  authRequestedSuccess: (state, action) => {
    state.auth = { ...action.payload, isLoggedIn: true };
  }
  },
  authRequestedFailed: (state, action) => {
    state.error = action.payload;
  }
});

const { reducer: usersReducer, actions } = usersSlice;
const { usersRequested, usersReceved, usersRequestFiled, authRequestedSuccess, authRequestedFailed } = actions;
const authRequested = createAction("users/authRequested");
export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
  dispatch(authRequested());
  try {
    const data = await authService.register({ email, password });
    localStorageService.setTokens(data);
    dispatch(authRequestedSuccess({
      userId: data.localId
    }));
  } catch (error) {
    dispatch(authRequestedFailed(error.message));
  }
};

export const loadUsersList = () => async (dispatch, getState) => {
      dispatch(usersRequested());
      try {
          const { content } = await userService.get();
          dispatch(usersReceved(content));
      } catch (error) {
          dispatch(usersRequestFiled(error.message));
      }
};

export const getUserById = (userId) => state => {
   if (state.users.entities) {
     return state.users.entities.find((u) => u._id);
   }
};

export const getUsersList = () => (state) => state.users.entities;

export default usersReducer;
