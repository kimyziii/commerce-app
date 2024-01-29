import { db } from '@/firebase/firebase'
import { DocumentData, doc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const useFetchDocument = (collectionName: string, documentId: string) => {
  const [document, setDocument] = useState<DocumentData | null>(null)

  const getDocument = useCallback(async () => {
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const obj = {
        id: documentId,
        ...docSnap.data(),
      }

      setDocument(obj)
    } else {
      toast.error('Document not found')
    }
  }, [collectionName, documentId])

  useEffect(() => {
    getDocument()
  }, [getDocument])

  return { document }
}

export default useFetchDocument
