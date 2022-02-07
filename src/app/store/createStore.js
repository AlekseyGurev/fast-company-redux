import professionsReducer from "./professions";
import qualitiesReducer from "./qualities";
import usersReducer from "./users";
const { combineReducers, configureStore } = require("@reduxjs/toolkit");

const rootReducer = combineReducers({ qualities: qualitiesReducer, professions: professionsReducer, users: usersReducer });

export function createStore() {
    return configureStore({
        reducer: rootReducer
    });
}
