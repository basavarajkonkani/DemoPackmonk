import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import catalogReducer from './catalogSlice';
import configurableCatalogReducer from './configurableCatalogSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import pouchReducer from './pouchSlice';
import authReducer from './authSlice';
import customersReducer from './customersSlice';
import inventoryReducer from './inventorySlice';
import bannersReducer from './bannersSlice';
import pricingReducer from './pricingSlice';
import addressesReducer from './addressesSlice';
import teamReducer from './teamSlice';
import supportReducer from './supportSlice';
import designsReducer from './designsSlice';
import wishlistReducer from './wishlistSlice';
import notificationsReducer from './notificationsSlice';
import invoicesReducer from './invoicesSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    configurableCatalog: configurableCatalogReducer,
    cart: cartReducer,
    orders: ordersReducer,
    pouch: pouchReducer,
    customers: customersReducer,
    inventory: inventoryReducer,
    banners: bannersReducer,
    pricing: pricingReducer,
    addresses: addressesReducer,
    team: teamReducer,
    support: supportReducer,
    designs: designsReducer,
    wishlist: wishlistReducer,
    notifications: notificationsReducer,
    invoices: invoicesReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type-safe Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
