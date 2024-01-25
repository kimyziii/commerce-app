'use client'
import Button from '@/components/button/Button'
import Heading from '@/components/haeding/Heading'
import Loader from '@/components/loader/Loader'
import { db, storage } from '@/firebase/firebase'
import useFetchDocument from '@/hooks/useFetchDocument'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from '../../add-product/AddProduct.module.scss'
import { categories } from '../../add-product/AddProductClient'

const initialState = {
  name: '',
  imageURL: '',
  price: 0,
  category: '',
  brand: '',
  desc: '',
}

const EditProductClient = () => {
  const { id } = useParams()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { document } = useFetchDocument('products', id)
  const [product, setProduct] = useState(document)

  useEffect(() => {
    setProduct(document)
  }, [document])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleImageChange = (e) => {
    e.preventDefault()
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

  const editProduct = (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (product.imageURL !== document.imageURL) {
      const storageRef = ref(storage, document.imageURL)
      deleteObject(storageRef)
    }

    try {
      setDoc(doc(db, 'products', id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: document.createdAt,
        modifiedAt: Timestamp.now().toDate(),
      })
      setIsLoading(false)
      setUploadProgress(0)
      setProduct({ ...initialState })

      toast.success(`상품 수정 완료!`)
      router.push('/admin/all-products')
    } catch (e) {
      setIsLoading(false)
      toast.error(e.message)
    }
  }

  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.product}>
        <Heading title='상품 수정하기' />
        {product === null ? (
          <Loader />
        ) : (
          <>
            <form onSubmit={editProduct}>
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
              <Button type='submit'>상품 수정</Button>
            </form>
          </>
        )}
      </div>
    </>
  )
}

export default EditProductClient
