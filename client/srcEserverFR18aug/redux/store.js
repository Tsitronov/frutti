import { configureStore } from "@reduxjs/toolkit";
import fruttiReducer from "./fruttiSlice";
import utentiReducer from "./utentiSlice";

export const store = configureStore({
  reducer: {
    frutti: fruttiReducer,
    utenti: utentiReducer
  },
});