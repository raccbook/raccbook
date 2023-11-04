import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { iPeriod } from '@/types'

export interface metaState {
  duration: iPeriod
}

const initialState: metaState = {
  duration: 1,
}

export const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    setDuration(state, action: PayloadAction<iPeriod>) {
      state.duration = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDuration } = metaSlice.actions

export const durationState = (state: RootState) => state.meta.duration

export default metaSlice.reducer
