import { configureStore } from "@reduxjs/toolkit";
import { persistReducer,persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducer from "./reducer";

const persistConfig={
    key:'root',
    storage,
};

const rootReducer= persistReducer(persistConfig,reducer)


const store=configureStore({
    reducer:{
        root:rootReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [
              "persist/PERSIST",
              "persist/REHYDRATE",
              "persist/REGISTER",
            ],
          },
        }),
})
const persistedStore = persistStore(store);

export { store, persistedStore };
export default store;
