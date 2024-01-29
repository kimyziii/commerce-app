'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import styles from './AddProduct.module.scss'
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader/Loader'
import Heading from '@/components/haeding/Heading'
import Button from '@/components/button/Button'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '@/firebase/firebase'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection } from 'firebase/firestore'

export const categories = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Electronics' },
  { id: 3, name: 'Fashion' },
  { id: 4, name: 'Phone' },
  { id: 5, name: 'Movies & TV' },
  { id: 6, name: 'Home & Kitchen' },
  { id: 7, name: 'Automotive' },
  { id: 8, name: 'Software' },
  { id: 9, name: 'Video Games' },
  { id: 10, name: 'Sports & Outdoor' },
  { id: 11, name: 'Toy & Games' },
  { id: 12, name: 'Industrial & Scientific' },
]

const initialState = {
  name: '',
  imageURL: '',
  price: 0,
  category: '',
  brand: '',
  desc: '',
}

const AddProductClient = () => {
  const [product, setProduct] = useState({ ...initialState })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files) return
    const file = e.target.files[0]
    const storageRef = ref(storage, `/images/${Date.now()}${file?.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)
      },
      (e) => {
        toast.error(e.message)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setProduct({ ...product, imageURL: url })
          toast.success(`이미지 업로드 완료!`)
        })
      },
    )
  }

  const addProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      addDoc(collection(db, 'products'), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: Timestamp.now().toDate(),
      })
      setIsLoading(false)
      setUploadProgress(0)
      setProduct({ ...initialState })

      toast.success(`상품 저장 완료!`)
      router.push('/admin/all-products')
    } catch (e) {
      setIsLoading(false)
      toast.error(getErrorMessage(e))
    }
  }

  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.product}>
        <Heading title='새로운 상품 업로드하기' />
        <form onSubmit={addProduct}>
          <label>상품 이름:</label>
          <input
            type='text'
            placeholder='상품 이름'
            required
            name='name'
            value={product.name}
            onChange={(e) => {
              handleInputChange(e)
            }}
          />

          <div>
            {uploadProgress === 0 ? null : (
              <div className={styles.progress}>
                <div
                  className={styles['progress-bar']}
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress < 100
                    ? `Uploading... ${uploadProgress}`
                    : `Upload Complete ${uploadProgress}`}
                </div>
              </div>
            )}

            <input
              type='file'
              placeholder='상품 이미지'
              accept='image/*'
              name='image'
              required
              onChange={(e) => handleImageChange(e)}
            />

            {product.imageURL === '' ? null : (
              <input
                type='text'
                name='imageURL'
                disabled
                value={product.imageURL}
                readOnly
                required
                placeholder='이미지 URL'
              />
            )}
          </div>
          <label>상품 가격:</label>
          <input
            type='number'
            placeholder='상품 가격'
            name='price'
            value={product.price}
            required
            onChange={(e) => handleInputChange(e)}
          />
          <label>상품 카테고리:</label>
          <select
            required
            name='category'
            value={product.category}
            onChange={(e) => handleInputChange(e)}
          >
            <option value='' disabled>
              --상품 카테고리 선택--
            </option>
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              )
            })}
          </select>

          <label>상품 브랜드</label>
          <input
            type='text'
            placeholder='상품 브랜드'
            name='brand'
            value={product.brand}
            onChange={(e) => handleInputChange(e)}
          />

          <label>상품 설명</label>
          <textarea
            name='desc'
            value={product.desc}
            cols={10}
            rows={10}
            onChange={(e) => handleInputChange(e)}
          ></textarea>
          <Button type='submit'>상품 생성</Button>
        </form>
      </div>
    </>
  )
}

export default AddProductClient
