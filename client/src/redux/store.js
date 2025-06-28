import { configureStore } from "@reduxjs/toolkit";
import fruttiReducer from "./fruttiSlice";

export const store = configureStore({
  reducer: {
    frutti: fruttiReducer,
  },
});