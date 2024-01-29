import { IProduct } from '@/types'
import { RootState } from '../store'

const { createSlice } = require('@reduxjs/toolkit')

interface IFilterState {
  filteredProducts: IProduct[]
}

const initialState: IFilterState = {
  filteredProducts: [],
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    FILTER_BY: (
      state: IFilterState,
      action: {
        payload: {
          products: IProduct[]
          category: string
          brand: string
          price: number
        }
      },
    ) => {
      const { products, category, brand, price } = action.payload
      let tempProducts = []

      if (category === 'All') {
        tempProducts = products
      } else {
        tempProducts = products.filter(
          (product) => product.category === category,
        )
      }

      if (brand === 'All') {
        tempProducts = tempProducts
      } else {
        tempProducts = tempProducts.filter(
          (product: IProduct) => product.brand === brand,
        )
      }

      tempProducts = tempProducts.filter(
        (product: IProduct) => product.price <= price,
      )

      state.filteredProducts = tempProducts
    },
    FILTER_BY_CATEGORY: (
      state: IFilterState,
      action: { payload: { products: IProduct[]; category: string } },
    ) => {
      const { products, category } = action.payload
      let tempProducts = []
      if (category === 'All') {
        tempProducts = products
      } else {
        tempProducts = products.filter(
          (product) => product.category === category,
        )
      }

      state.filteredProducts = tempProducts
    },

    FILTER_BY_BRAND: (
      state: IFilterState,
      action: { payload: { products: IProduct[]; brand: string } },
    ) => {
      const { products, brand } = action.payload
      let tempProducts = []
      if (brand === 'All') {
        tempProducts = products
      } else {
        tempProducts = products.filter((product) => product.brand === brand)
      }

      state.filteredProducts = tempProducts
    },

    FILTER_BY_PRICE: (
      state: IFilterState,
      action: { payload: { products: IProduct[]; price: number } },
    ) => {
      const { products, price } = action.payload
      let tempProducts = []
      tempProducts = products.filter((product) => product.price <= price)
      state.filteredProducts = tempProducts
    },

    SORT_PRODUCTS: (
      state: IFilterState,
      action: { payload: { products: IProduct[]; sort: string } },
    ) => {
      const { products, sort } = action.payload

      let temp: IProduct[] = []
      if (sort === 'latest') {
        temp = products
      }

      if (sort === 'lowest-price') {
        temp = products.slice().sort((a, b) => a.price - b.price)
      }

      if (sort === 'highest-price') {
        temp = products.slice().sort((a, b) => b.price - a.price)
      }

      state.filteredProducts = temp
    },

    FILTER_BY_SEARCH: (
      state: IFilterState,
      action: { payload: { products: IProduct[]; search: string } },
    ) => {
      const { products, search } = action.payload

      const tempProducts = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase())
        )
      })
      state.filteredProducts = tempProducts
    },
  },
})

export const {
  FILTER_BY,
  FILTER_BY_BRAND,
  FILTER_BY_PRICE,
  FILTER_BY_CATEGORY,
  SORT_PRODUCTS,
  FILTER_BY_SEARCH,
} = filterSlice.actions

export const selectFilteredProducts = (state: RootState) =>
  state.filter.filteredProducts

export default filterSlice.reducer
