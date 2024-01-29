'use client'
import React, { FormEvent } from 'react'
import styles from './CheckoutClient.module.scss'
import Heading from '@/components/haeding/Heading'
import CheckoutForm from '@/components/checkoutForm/CheckoutForm'
import Button from '@/components/button/Button'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { useDispatch, useSelector } from 'react-redux'
import {
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from '@/redux/slice/cartSlice'
import { toast } from 'react-toastify'
import { selectEmail, selectUserId } from '@/redux/slice/authSlice'
import { selectShippingAddress } from '@/redux/slice/checkoutSlice'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { useRouter } from 'next/navigation'

const CheckoutClient = () => {
  const userId = useSelector(selectUserId)
  const userEmail = useSelector(selectEmail)
  const cartItems = useSelector(selectCartItems)
  const shippingAddress = useSelector(selectShippingAddress)
  const cartTotalAmt = useSelector(selectCartTotalAmount)

  const dispatch = useDispatch()
  const router = useRouter()

  const randomKey = Math.random().toString(36).slice(2)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const tossPayment = await loadTossPayments(
      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!,
    )

    tossPayment
      .requestPayment('카드', {
        amount: cartTotalAmt,
        orderId: randomKey,
        orderName: `주문`,
      })
      .then(async function (data) {
        const { orderId, paymentKey, amount } = data
        const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY

        // 결제 승인 API 호출
        const url = `https://api.tosspayments.com/v1/payments/confirm`
        const basicToken = `${btoa(secretKey + ':')}`

        const confirmResponse = fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            amount,
            orderId,
            paymentKey,
          }),
          headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/json',
          },
        })

        const today = new Date()
        const date = today.toDateString()
        const time = today.toLocaleDateString()

        const orderData = {
          userId,
          userEmail,
          orderDate: date,
          orderTime: time,
          orderAmount: amount,
          orderStatus: '주문수락',
          cartItems,
          shippingAddress,
          createdAt: Timestamp.now().toDate(),
        }

        await addDoc(collection(db, 'orders'), orderData)
        dispatch(CLEAR_CART())

        router.push(`/checkout-success?orderId=${orderId}`)
      })
      .catch((error) => {
        if (error.code === 'USER_CANCEL') {
          toast.error('결제창을 다시 열어주세요.')
        }
      })
  }

  return (
    <section>
      <div className={styles.checkout}>
        <Heading title='주문하기' />
        <form onSubmit={handleSubmit}>
          <div className={styles.card}>
            <CheckoutForm />
          </div>
          <div>
            <Button type='submit'>토스 결제</Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CheckoutClient
