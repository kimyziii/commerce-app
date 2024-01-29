export interface IProduct {
  id: string
  brand: string
  category: string
  description: string
  imageURL: string
  name: string
  price: number
}

export interface IShippingAddress {
  city: string
  line: string
  name: string
  postalCode: string
}

// 타입으로 해도 되고
export type TCartItems = IProduct & { cartQuantity: number }

export interface ICartItems {
  id: string
  brand: string
  category: string
  description: string
  imageURL: string
  name: string
  price: number
  quantity: number
  cartQuantity: number
}

export interface IOrder {
  id: string
  orderAmount: number
  orderDate: string
  orderStatus: string
  orderTime: string
  userEmail: string
  userId: string
  cartItems: ICartItems[]
  shippingAddress: IShippingAddress
  createdAt: {
    seconds: number
    nanoseconds: number
  }
}
