import { Ask, Bid } from '@/types/orders'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

export interface orderState {
  bids: Bid[]
  asks: Ask[]
}

const initialState: orderState = {
  bids: [],
  asks: [],
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setBids(state, action: PayloadAction<Bid[]>) {
      state.bids = action.payload
    },
    setAsks(state, action: PayloadAction<Ask[]>) {
      state.asks = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setBids, setAsks } = orderSlice.actions

export const bidsState = (state: RootState) => state.order.bids
export const asksState = (state: RootState) => state.order.asks

export default orderSlice.reducer
