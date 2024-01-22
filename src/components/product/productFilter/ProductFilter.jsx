import Button from '@/components/button/Button'
import { FILTER_BY } from '@/redux/slice/filterSlice'
import {
  selectMaxPrice,
  selectMinPrice,
  selectProducts,
} from '@/redux/slice/productSlice'
import { priceFormat } from '@/utils/priceFormat'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ProductFilter.module.scss'

const ProductFilter = () => {
  const [category, setCategory] = useState('All')
  const [brand, setBrand] = useState('All')
  const [price, setPrice] = useState(100000)

  const products = useSelector(selectProducts)
  const minPrice = useSelector(selectMinPrice)
  const maxPrice = useSelector(selectMaxPrice)

  const dispatch = useDispatch()

  const allCategories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ]

  const filterCategories = (category) => {
    setCategory(category)
  }

  const allBrands = [
    'All',
    ...new Set(products.map((product) => product.brand)),
  ]

  useEffect(() => {
    dispatch(FILTER_BY({ products, category, brand, price }))
  }, [brand, category, dispatch, price, products])

  const clearFilters = () => {
    setCategory('All')
    setBrand('All')
    setPrice(maxPrice)
  }

  return (
    <div className={styles.filter}>
      <h4>카테고리</h4>
      <div className={styles.category}>
        {allCategories.map((c, idx) => {
          return (
            <button
              key={c}
              type='button'
              className={`${category}` === c ? `${styles.active}` : ''}
              // className={`${category}` === cat ? `${styles.active}` : ''}
              onClick={() => filterCategories(c)}
            >
              &#8250; {c}
            </button>
          )
        })}
      </div>

      <h4>브랜드</h4>
      <div className={styles.brand}>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrands.map((b, idx) => {
            return (
              <option key={b} value={b}>
                {b}
              </option>
            )
          })}
        </select>
      </div>

      <h4>가격</h4>
      <p>{priceFormat(Number(price))}원</p>
      <div className={styles.price}>
        <input
          type='range'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={minPrice}
          max={maxPrice}
        />
      </div>

      <Button onClick={clearFilters}>필터 초기화</Button>
    </div>
  )
}

export default ProductFilter
