import { configureStore } from "@reduxjs/toolkit";
import appuntiReducer from "./appuntiSlice";
import fruttiReducer from "./fruttiSlice";
import utentiReducer from "./utentiSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    appunti: appuntiReducer,
    frutti: fruttiReducer,
    utenti: utentiReducer,
    users: usersReducer
  },
});