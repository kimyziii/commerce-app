'use client'
import React, { useEffect, useState } from 'react'
import styles from './OrderHistoryClient.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { STORE_ORDERS, selectOrderHistory } from '@/redux/slice/orderSlice'
import { selectUserId } from '@/redux/slice/authSlice'
import Heading from '@/components/haeding/Heading'
import Loader from '@/components/loader/Loader'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { formatTime } from '@/utils/dayjs'
import { priceFormat } from '@/utils/priceFormat'
import { useRouter } from 'next/navigation'

const OrderHistoryClient = () => {
  const userId = useSelector(selectUserId)

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function fetchData() {
    setIsLoading(true)
    const q = query(collection(db, 'orders'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)

    let obj = []
    querySnapshot.forEach((doc) => {
      obj.push({ id: doc.id, ...doc.data() })
    })

    setData(obj)
    setIsLoading(false)
  }

  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(STORE_ORDERS(data))
  }, [data, dispatch])

  useEffect(() => {
    fetchData()
  }, [userId])

  const orders = useSelector(selectOrderHistory)

  const handleClick = (id) => {
    router.push(`/order-details/${id}`)
  }

  return (
    <section className={styles.order}>
      <Heading title='주문 목록' />
      {isLoading && <Loader />}

      <div className={styles.table}>
        {orders.length === 0 ? (
          <p>주문 목록이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>순서</th>
                <th>주문 날짜</th>
                <th>주문 아이디</th>
                <th>주문 금액</th>
                <th>주문 상태</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const { id, orderDate, orderTime, orderAmount, orderStatus } =
                  order
                return (
                  <tr key={id} onClick={() => handleClick(id)}>
                    <td>{index + 1}</td>
                    <td>{formatTime(orderDate)}</td>
                    <td>{id}</td>
                    <td>{priceFormat(orderAmount)}원</td>
                    <td>
                      <p
                        className={
                          orderStatus !== '배송완료'
                            ? `${styles.pending}`
                            : `${styles.delevered}`
                        }
                      >
                        {orderStatus}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default OrderHistoryClient
