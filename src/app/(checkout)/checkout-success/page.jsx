import Heading from '@/components/haeding/Heading'
import React from 'react'
import styles from './CheckoutSuccess.module.scss'
import { priceFormat } from '@/utils/priceFormat'
import { formatTime } from '@/utils/dayjs'
import Button from '@/components/button/Button'
import Link from 'next/link'

const CheckoutSuccess = async ({ searchParams }) => {
  const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY
  const url = `https://api.tosspayments.com/v1/payments/orders/${searchParams.orderId}`
  const basicToken = `${btoa(secretKey + ':')}`

  const payment = await fetch(url, {
    headers: {
      Authorization: `Basic ${basicToken}`,
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    return await res.json()
  })
  console.log(payment)

  const { card } = payment

  return (
    <section className={styles.success}>
      <Heading title='결제 성공' />
      <ul className={styles.list}>
        <li>
          <b>결제 상품: </b>
          {payment.orderName}
        </li>
        <li>
          <b>주문 번호 : </b>
          {payment.orderId}
        </li>
        <li>
          <b>카드 번호: </b>
          {card.number}
        </li>
        <li>
          <b>결제 금액: </b>
          {priceFormat(card.amount)}원
        </li>
        <li>
          <b>결제승인날짜: </b> {formatTime(payment.approvedAt)}
        </li>
      </ul>

      <Button>
        <Link href={'/order-history'}>주문 목록 보기</Link>
      </Button>
    </section>
  )
}

export default CheckoutSuccess
