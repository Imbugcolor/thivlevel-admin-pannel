import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface SocketState {
  socket: any,
}

// Define the initial state using that type
const initialState: SocketState = {
  socket: null,
}

export const ClientSlice = createSlice({
  name: 'client',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<any>) => {
        state.socket = action.payload
    },
  }
})

export const { connect } = ClientSlice.actions

export default ClientSlice.reducer