import { IShippingAddress } from '@/types'
import { RootState } from '../store'

const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  shippingAddress: {} as IShippingAddress,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    SAVE_SHIPPING_ADDRESS: (
      state: { shippingAddress: string },
      action: { payload: string },
    ) => {
      state.shippingAddress = action.payload
    },
  },
})

export const { SAVE_SHIPPING_ADDRESS } = checkoutSlice.actions

export const selectShippingAddress = (state: RootState) =>
  state.checkout.shippingAddress

export default checkoutSlice.reducer
