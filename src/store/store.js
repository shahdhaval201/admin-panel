import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import estimationReducer from './estimationSlice'; // Import the estimation reducer
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from "redux-persist";

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['projects', 'estimations'], // Only persist the projects and estimations slices
};

// Persisted reducers
const persistedProjectReducer = persistReducer(persistConfig, projectReducer);
const persistedEstimationReducer = persistReducer(persistConfig, estimationReducer);

const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication State
    projects: persistedProjectReducer, // Project State
    estimations: persistedEstimationReducer, // Estimation State
  },
});

export const persistor = persistStore(store);

export default store;
