'use client'
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QTY,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from '@/redux/slice/cartSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './CheckoutForm.module.scss'
import Link from 'next/link'
import { priceFormat } from '@/utils/priceFormat'
import { ICartItems } from '@/types'

const CheckoutForm = () => {
  const cartItems = useSelector(selectCartItems)
  const cartTotalQty = useSelector(selectCartTotalQuantity)
  const cartTotalAmt = useSelector(selectCartTotalAmount)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL())
    dispatch(CALCULATE_TOTAL_QTY())
  }, [dispatch, cartItems])

  return (
    <div className={styles.summary}>
      <h3>주문 요약</h3>
      <div>
        {cartItems.length === 0 ? (
          <>
            <p>장바구니에 상품이 없습니다.</p>
            <Link href='/'>홈페이지로 돌아가기</Link>
          </>
        ) : (
          <>
            <div>
              {cartItems.map((item: ICartItems) => {
                const { id, name, price, cartQuantity } = item
                return (
                  <div key={id} className={styles.card}>
                    <p>
                      <b>상품: </b>
                      {name}
                    </p>
                    <p>
                      <b>개수: </b>
                      {cartQuantity}
                    </p>
                    <p>
                      <b>가격: </b>
                      {priceFormat(price)}원
                    </p>
                    <p>
                      <b>세트 가격: </b>
                      {priceFormat(price * cartQuantity)}원
                    </p>
                  </div>
                )
              })}

              <div className={styles.text}>
                <p>
                  <b>총 상품 개수: </b>
                  {cartTotalQty}
                </p>
              </div>

              <div className={styles.text}>
                <p>
                  <b>합계: </b>
                  {priceFormat(cartTotalAmt)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutForm
