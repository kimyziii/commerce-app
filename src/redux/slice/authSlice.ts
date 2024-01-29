import { RootState } from '../store'

const { createSlice } = require('@reduxjs/toolkit')

interface IAuthState {
  isLoggedIn: boolean
  email: null | string
  userId: null | string
  userName: null | string
}

const initialState: IAuthState = {
  isLoggedIn: false,
  email: null,
  userName: null,
  userId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_ACTIVE_USER: (
      state: IAuthState,
      action: { payload: { email: string; userName: string; userId: string } },
    ) => {
      const { email, userName, userId } = action.payload
      state.isLoggedIn = true
      state.email = email
      state.userName = userName
      state.userId = userId
    },
    REMOVE_ACTIVE_USER: (state: IAuthState) => {
      state.isLoggedIn = false
      state.email = null
      state.userName = null
      state.userId = null
    },
  },
})

export const { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } = authSlice.actions

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectEmail = (state: RootState) => state.auth.email
export const selectUserName = (state: RootState) => state.auth.userName
export const selectUserId = (state: RootState) => state.auth.userId

export default authSlice.reducer
