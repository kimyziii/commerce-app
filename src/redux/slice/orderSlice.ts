import { IOrder } from '@/types'
import { RootState } from '../store'

const { createSlice } = require('@reduxjs/toolkit')

interface IOrderState {
  orderHistory: IOrder[]
  totalOrderAmount: null | number
}

const initialState: IOrderState = {
  orderHistory: [],
  totalOrderAmount: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    STORE_ORDERS(state: IOrderState, action: { payload: IOrder[] }) {
      state.orderHistory = action.payload
    },
    CALCULATE_TOTAL_ORDER_AMOUNT(state: IOrderState) {
      const array: number[] = []
      state.orderHistory.map((item: IOrder) => {
        const { orderAmount } = item
        return array.push(orderAmount)
      })

      const totalAmount = array.reduce((a, b) => a + b, 0)
      state.totalOrderAmount = totalAmount
    },
  },
})

export const { STORE_ORDERS, CALCULATE_TOTAL_ORDER_AMOUNT } = orderSlice.actions

export const selectOrderHistory = (state: RootState) =>
  state.orders.orderHistory
export const selectTotalOrderAmount = (state: RootState) =>
  state.orders.totalOrderAmount

export default orderSlice.reducer
