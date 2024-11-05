
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../interfaces/schema/user.interface'

// Define a type for the slice state
export interface AuthState {
  token: string | null,
  user: User | null
}

// Define the initial state using that type
const initialState: AuthState = {
  token: null,
  user: null,
}

export const AuthSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
        state.token = action.payload.token
        state.user = action.payload.user
    },
    logout: (state) => {
       state.token = null
       state.user = null
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    }
  }
})

export const { login, logout, updateToken, updateUser } = AuthSlice.actions

export default AuthSlice.reducer