'use client'
import React from 'react'

const OrderDetails = ({ params, searchParams }) => {
  // /order-details/2333/filter=2023

  const { id } = params // 2333
  const { filter } = searchParams // 2023

  console.log(id, filter)

  return (
    <div>
      <div>{id}</div>
      <div>{filter}</div>
    </div>
  )
}

export default OrderDetails
