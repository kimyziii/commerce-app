import { IProduct } from '@/types'
import { RootState } from '../store'

const { createSlice } = require('@reduxjs/toolkit')

interface IProductState {
  products: IProduct[]
  minPrice: null | number
  maxPrice: null | number
}

const initialState: IProductState = {
  products: [],
  minPrice: null,
  maxPrice: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    STORE_PRODUCTS(
      state: IProductState,
      action: { payload: { products: IProduct[] } },
    ) {
      state.products = action.payload.products
    },
    GET_PRICE_RANGE(
      state: IProductState,
      action: { payload: { products: IProduct[] } },
    ) {
      const { products } = action.payload
      const array: number[] = []

      products.map((product: IProduct) => {
        const price = product.price
        return array.push(price)
      })

      const max = Math.max(...array)
      const min = Math.min(...array)

      state.minPrice = min
      state.maxPrice = max
    },
  },
})

export const { STORE_PRODUCTS, GET_PRICE_RANGE } = productSlice.actions

export const selectProducts = (state: RootState) => state.product.products
export const selectMinPrice = (state: RootState) => state.product.minPrice
export const selectMaxPrice = (state: RootState) => state.product.maxPrice

export default productSlice.reducer
