'use client'
// Import Provider từ react-redux và store từ file store.js
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./store";

// Tạo ra component ReduxProviders để bọc các component khác trong ứng dụng
export default function ReduxProviders({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}

