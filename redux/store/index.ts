import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../reducers/auth";
import assetsReducer from "../reducers/assets";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logger from "redux-logger";
import activeUserSlice from "../reducers/activeUser";
import { transform as activeUserTransform } from "../reducers/activeUser";

const rootReducer = combineReducers({
  auth: authReducer,
  assets: assetsReducer,
  activeUser: activeUserSlice,
});

const persistConfig = {
  key: "v5",
  version: 1,
  storage: AsyncStorage,
  transforms: [activeUserTransform],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
) as typeof rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
