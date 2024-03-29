import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logger from "redux-logger";

import authReducer, {
  AuthState,
  transform as authTransform,
} from "../reducers/auth";
import assetsReducer, {
  AssetsState,
  transform as assetsTransform,
} from "../reducers/assets";
import contactsReducer, {
  ContactsState,
  transform as contactsTransform,
} from "../reducers/contacts";
import activeUserSlice, {
  ActiveUserState,
  transform as activeUserTransform,
} from "../reducers/activeUser";
import sharedAssetsSlice, { SharedAssetsState } from "../reducers/sharedAssets";
import geofencesSlice, {
  GeofencesState,
  transform as geofencesTransform,
} from "../reducers/geofences";
import notificationsSlice, {
  NotificationsState,
  transform as notificationsTransform,
} from "../reducers/notifications";

const rootReducer = combineReducers({
  auth: authReducer,
  assets: assetsReducer,
  activeUser: activeUserSlice,
  contacts: contactsReducer,
  sharedAssets: sharedAssetsSlice,
  geofences: geofencesSlice,
  notifications: notificationsSlice,
});

const persistConfig: PersistConfig<RootState> = {
  key: "v14",
  version: 1,
  storage: AsyncStorage,
  transforms: [
    assetsTransform,
    activeUserTransform,
    contactsTransform,
    geofencesTransform,
    authTransform,
    notificationsTransform,
  ],
  blacklist: ["sharedAssets", "geofences", "alarms"],
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
  sharedAssets: SharedAssetsState;
  geofences: GeofencesState;
  notifications: NotificationsState;
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
