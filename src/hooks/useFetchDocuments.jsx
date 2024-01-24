'use client'
import { db } from '@/firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

const useFetchDocuments = (collectionName, arg) => {
  const [documents, setDocuments] = useState([])
  const getDocuments = useCallback(async () => {
    const q = query(
      collection(db, collectionName),
      where(arg[0], arg[1], arg[2]),
    )
    const querySnapshot = await getDocs(q)
    let documentsArray = []

    querySnapshot.forEach((doc) => {
      documentsArray.push({ id: doc.id, ...doc.data() })
    })

    setDocuments(documentsArray)
    // arg를 의존성 배열로 넣게 되면 무한루프 돌게 됨 (다른 주소 참조)
  }, [arg[0], arg[1], arg[2], collectionName])

  useEffect(() => {
    getDocuments()
  }, [getDocuments])

  return { documents }
}

export default useFetchDocuments
