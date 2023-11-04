import { configureStore } from '@reduxjs/toolkit'
import { metaSlice } from './meta'
import { orderSlice } from './orders'

export const store = configureStore({
  reducer: {
    order: orderSlice?.reducer,
    meta: metaSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable serializable check middleware
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
