import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import history from "../utils/history";

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
    state.auth = action.payload;
    state.isLoggedIn = true;
  }
  },
  authRequestedFailed: (state, action) => {
    state.error = action.payload;
  },
  userCreated: (state, action) => {
    state.entities.push(action.payload);
  }
});

const { reducer: usersReducer, actions } = usersSlice;
const { usersRequested, usersReceved, usersRequestFiled, authRequestedSuccess, authRequestedFailed, userCreated } = actions;
const authRequested = createAction("users/authRequested");
const userCreateReauested = createAction("users/userCreateReauested");
const createUserFailed = createAction("users/createUserFailed");
const createUser = (payload) => async (dispatch) => {
  dispatch(userCreateReauested());
  try {
    const { content } = await userService.update(payload);
    dispatch(userCreated(content));
    history.push("/users");
  } catch (error) {
    dispatch(createUserFailed(error.message));
  }
};
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const logIn = ({ payload, redirect }) => async (dispatch) => {
  const { email, password } = payload;
  dispatch(authRequested());
  try {
    const data = await authService.login({ email, password });
    dispatch(authRequestedSuccess({ userId: data.localId }));
    localStorageService.setTokens(data);
    history.push(redirect);
  } catch (error) {
    dispatch(authRequestedFailed(error.message));
  }
};

export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
  dispatch(authRequested());
  try {
    const data = await authService.register({ email, password });
    localStorageService.setTokens(data);
    dispatch(authRequestedSuccess({
      userId: data.localId
    }));
    dispatch(createUser({
      _id: data.localId,
      email,
      rate: randomInt(1, 5),
      completedMeetings: randomInt(0, 200),
      image: `https://avatars.dicebear.com/api/avataaars/${(
          Math.random() + 1
      )
          .toString(36)
          .substring(7)}.svg`,
      ...rest
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
export const getIsLoggedIn = () => (state) => state.isLoggedIn;

export default usersReducer;
