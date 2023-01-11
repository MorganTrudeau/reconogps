import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "../reducers/auth";
import assetsReducer, { AssetsState } from "../reducers/assets";
import contactsReducer, { ContactsState } from "../reducers/contacts";
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
import activeUserSlice, { ActiveUserState } from "../reducers/activeUser";
import { transform as activeUserTransform } from "../reducers/activeUser";

const rootReducer = combineReducers({
  auth: authReducer,
  assets: assetsReducer,
  activeUser: activeUserSlice,
  contacts: contactsReducer,
});

const persistConfig = {
  key: "v8",
  version: 1,
  storage: AsyncStorage,
  transforms: [activeUserTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
export type RootState = {
  auth: AuthState;
  assets: AssetsState;
  activeUser: ActiveUserState;
  contacts: ContactsState;
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
