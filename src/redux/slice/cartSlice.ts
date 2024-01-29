import { ICartItems } from '@/types'
import { RootState } from '../store'

const { createSlice } = require('@reduxjs/toolkit')

interface ICartState {
  cartItems: ICartItems[]
  cartTotalQuantity: number
  cartTotalAmount: number
  previousURL: string
}

const initialState = {
  cartItems:
    typeof window !== 'undefined'
      ? localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems')!)
        : []
      : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  previousURL: '',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    ADD_TO_CART: (state: ICartState, action: { payload: ICartItems }) => {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      )

      const increaseCount = action.payload.quantity
        ? action.payload.quantity
        : 1

      if (productIndex >= 0) {
        state.cartItems[productIndex].cartQuantity += increaseCount
      } else {
        const tempProduct = { ...action.payload, cartQuantity: increaseCount }
        state.cartItems.push(tempProduct)
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    CALCULATE_TOTAL_QTY: (state: ICartState) => {
      const array: number[] = []
      state.cartItems.map((item) => {
        const { cartQuantity } = item
        const qty = cartQuantity
        return array.push(qty)
      })

      if (array.length > 0) {
        const totalQty = array.reduce((a, b) => a + b)
        state.cartTotalQuantity = totalQty
      } else {
        state.cartTotalQuantity = 0
      }
    },
    CALCULATE_SUBTOTAL: (state: ICartState) => {
      const array: number[] = []
      state.cartItems.map((item) => {
        const { price, cartQuantity } = item
        const cartItemAmount = price * cartQuantity
        return array.push(cartItemAmount)
      })

      if (array.length > 0) {
        const totalAmt = array.reduce((a, b) => a + b)
        state.cartTotalAmount = totalAmt
      } else {
        state.cartTotalAmount = 0
      }
    },
    SAVE_URL: (state: ICartState, action: { payload: string }) => {
      state.previousURL = action.payload
    },
    DECREASE_CART: (state: ICartState, action: { payload: ICartItems }) => {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      )

      if (state.cartItems[productIndex].cartQuantity > 1) {
        state.cartItems[productIndex].cartQuantity -= 1
      } else if (state.cartItems[productIndex].cartQuantity === 1) {
        const newCartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id,
        )
        state.cartItems = newCartItems
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    INCREASE_CART: (state: ICartState, action: { payload: ICartItems }) => {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id,
      )

      state.cartItems[productIndex].cartQuantity++
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    REMOVE_FROM_CART: (state: ICartState, action: { payload: ICartItems }) => {
      const newCartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id,
      )
      state.cartItems = newCartItems

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    CLEAR_CART: (state: ICartState, action: { payload: ICartItems }) => {
      state.cartItems = []
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
  },
})

export const {
  ADD_TO_CART,
  CALCULATE_TOTAL_QTY,
  CALCULATE_SUBTOTAL,
  SAVE_URL,
  INCREASE_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
} = cartSlice.actions
export const selectCartItems = (state: RootState) => state.cart.cartItems
export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.cartTotalQuantity
export const selectCartTotalAmount = (state: RootState) =>
  state.cart.cartTotalAmount

export default cartSlice.reducer
