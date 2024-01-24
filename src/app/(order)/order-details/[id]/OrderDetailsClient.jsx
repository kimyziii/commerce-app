'use client'
import React from 'react'
import styles from './OrderDetailsClient.module.scss'
import { useParams, useRouter } from 'next/navigation'
import useFetchDocument from '@/hooks/useFetchDocument'
import Heading from '@/components/haeding/Heading'
import Loader from '@/components/loader/Loader'
import Image from 'next/image'
import { priceFormat } from '@/utils/priceFormat'
import Button from '@/components/button/Button'

const OrderDetailsClient = () => {
  const { id } = useParams()
  const { document: order } = useFetchDocument('orders', id)

  const router = useRouter()
  const handleClick = (id) => {
    router.push(`/review-product/${id}`)
  }

  return (
    <section className={styles.table}>
      <Heading title='주문 상세정보' />
      {order === null ? (
        <Loader />
      ) : (
        <>
          <div className={styles.details}>
            <p>
              <b>주문 아이디</b> {order.id}
            </p>
            <p>
              <b>주문 가격</b> {order.orderAmount} 원
            </p>
            <p>
              <b>주문 아이디</b> {order.orderStatus}
            </p>
            <table>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>상품</th>
                  <th>가격</th>
                  <th>개수</th>
                  <th>합계</th>
                  <th>실행</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((item, index) => {
                  const { id, name, price, imageURL, cartQuantity } = item
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <Image
                          src={imageURL}
                          alt={name}
                          width={100}
                          height={100}
                        />
                      </td>
                      <td>{priceFormat(price)}원</td>
                      <td>{cartQuantity}</td>
                      <td>{priceFormat(price * cartQuantity)}원</td>
                      <td className={styles.icons}>
                        <Button onClick={() => handleClick(id)}>
                          상품 리뷰하기
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default OrderDetailsClient
