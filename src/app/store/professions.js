import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionsSlice = createSlice({
  name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
      professionsRequested: (state) => {
        state.isLoading = true;
    },
    professionsReceved: (state, action) => {
        state.entities = action.payload;
        state.lastFetch = Date.now();
        state.isLoading = false;
    },
    professionsRequestFiled: (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
    }
    }
});

function isOutdated(date) {
  if (Date.now() - date > 10 * 60 * 1000) {
      return true;
  }
  return false;
}

export const loadProfessionsList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().professions;
  if (isOutdated(lastFetch)) {
    dispatch(professionsRequested());
    try {
        const { content } = await professionService.get();
        dispatch(professionsReceved(content));
    } catch (error) {
        dispatch(professionsRequestFiled(error.message));
    }
}
};

export const getProfessionsId = (id) => (state) => {
  return state.professions.entities.find((p) => p._id === id);
};
export const getProfessionsLoadingStatus = () => (state) => state.professions.isLoading;
export const getProfessions = () => (state) => state.professions.entities;

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequested, professionsReceved, professionsRequestFiled } = actions;

export default professionsReducer;