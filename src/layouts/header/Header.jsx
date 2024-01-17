'use client'

import React, { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { toast } from 'react-toastify'
import { usePathname, useRouter } from 'next/navigation'
import InnerHeader from '../innerHeader/InnerHeader'
import { useDispatch } from 'react-redux'
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from '@/redux/slice/authSlice'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName === null) {
          const emailId = user.email.split('@')[0]
          const uName = emailId.charAt(0).toUpperCase() + emailId.slice(1)
          setDisplayName(uName)
        } else {
          setDisplayName(user.displayName)
        }

        // 유저 정보 저장하기
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: displayName,
            userId: user.uid,
          }),
        )
      } else {
        setDisplayName('')
        // 유저 정보 삭제하기
        dispatch(REMOVE_ACTIVE_USER())
      }
    })
  }, [dispatch, displayName])

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success(`로그아웃 되었습니다.`)
        router.push('/')
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  const nonVisiblePathname = ['/login', '/register', '/reset']
  if (nonVisiblePathname.includes(pathname)) return null

  return (
    <header>
      <div className={styles.loginBar}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link href={'/login'}>로그인</Link>
          </li>
          <li className={styles.item}>
            <Link href={'/admin/dashboard'}>관리자</Link>
          </li>
          <li className={styles.item}>
            <Link href={'/order-history'}>주문 목록</Link>
          </li>
          <li className={styles.item}>
            <Link href={'/'} onClick={logoutUser}>
              로그아웃
            </Link>
          </li>
          <li className={styles.item}>
            <Link href={'/'}>제휴 마케팅</Link>
          </li>
          <li className={styles.item}>
            <Link href={'/'}>쿠팡 플레이</Link>
          </li>
          <li className={styles.item}>
            <Link href={'/'}>고객센터</Link>
          </li>
        </ul>
      </div>

      {pathname.startsWith('/admin') ? null : <InnerHeader />}
    </header>
  )
}

export default Header
