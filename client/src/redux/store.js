import { configureStore } from "@reduxjs/toolkit";
import fruttiReducer from "./fruttiSlice";
import utentiReducer from "./utentiSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    frutti: fruttiReducer,
    utenti: utentiReducer,
    users: usersReducer
  },
});