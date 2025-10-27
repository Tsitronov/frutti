import { configureStore } from "@reduxjs/toolkit";
import appuntiReducer from "./appuntiSlice";
import fruttiReducer from "./fruttiSlice";
import utentiReducer from "./utentiSlice";
import usersReducer from "./usersSlice";
import photosReducer from "./photosSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    appunti: appuntiReducer,
    frutti: fruttiReducer,
    utenti: utentiReducer,
    users: usersReducer,
    photos: photosReducer,
    theme: themeReducer
  },
});