//Chèn configureStore từ thư viện @reduxjs/toolkit
import { configureStore } from '@reduxjs/toolkit';
//Import slice từ file cartslice
import cartSlice from './slices/cartslices.js';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//Cấu hình persist cho cart
const persistConfig = {
    key: 'cart',
    storage,
};

//Tạo persisted reducer
const persistedCartReducer = persistReducer(persistConfig, cartSlice.reducer);

//Tạo store bằng hàm configureStore
export const store = configureStore({
    reducer: {
        //Thêm reducer cart vào store
        cart: persistedCartReducer,
        // search: searchSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

//Tạo persistor
export const persistor = persistStore(store);
