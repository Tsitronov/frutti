import { configureStore } from "@reduxjs/toolkit";
import appuntiReducer from "./appuntiSlice";
import articoliReducer from "./articoliSlice";
import fruttiReducer from "./fruttiSlice";
import utentiReducer from "./utentiSlice";
import usersReducer from "./usersSlice";
import photosReducer from "./photosSlice";
import themeReducer from "./themeSlice";
import botReducer from "./botSlice";

export const store = configureStore({
  reducer: {
    appunti: appuntiReducer,
    articoli: articoliReducer,
    frutti: fruttiReducer,
    utenti: utentiReducer,
    users: usersReducer,
    photos: photosReducer,
    theme: themeReducer,
    bot: botReducer
  },
});