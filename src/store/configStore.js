import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import UserDux from "./userDux";
import FilesDux from "./filesDux";
import CommonDux from "./commonDux";
import videoDux from "./videoDux";
import CommnetDux from "./commentDux";
import tweet from "./tweetDux";

const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers (if multiple)
const rootReducer = combineReducers({
  user: UserDux,
  video: videoDux,
  file: FilesDux,
  tweet: tweet,
  common: CommonDux,
  comment: CommnetDux,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
