'use client'
import Image from 'next/image'
import React, { useState } from 'react'

import LogoPath from '@/assets/colorful.svg'
import ArrowLogoPath from '@/assets/arrow.svg'
import { useRouter } from 'next/navigation'

import styles from './Auth.module.scss'
import Loader from '@/components/loader/Loader'
import Input from '@/components/input/Input'
import AutoSignInCheckbox from '@/components/autoSignInCheckbox/AutoSignInCheckbox'
import Devider from '@/components/devider/Devider'
import Button from '@/components/button/Button'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/firebase/firebase'

const LoginClient = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAutoLogin, setIsAutoLogin] = useState(false)

  const router = useRouter()

  const redirectUser = () => {
    router.push('/')
  }

  const loginUser = (e) => {
    e.preventDefault()
    setIsLoading(true)

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false)
        toast.success(`로그인 성공!`)
        redirectUser()
      })
      .catch((e) => {
        setIsLoading(false)
        toast.error(e.message)
      })
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then((result) => {
        toast.success(`로그인 성공!`)
        redirectUser()
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  return (
    <>
      {isLoading && <Loader />}
      <section className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.logo}>
            <Image priority src={LogoPath} alt='logo' />
          </h1>

          <form onSubmit={loginUser} className={styles.form}>
            <Input
              email
              icon='letter'
              id='email'
              name='email'
              label='이메일'
              placeholder='아이디(이메일)'
              className={styles.control}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />

            <Input
              password
              icon='lock'
              id='password'
              name='password'
              label='비밀번호'
              placeholder='비밀번호'
              className={styles.control}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
            <div className={styles.group}>
              {/* 자동 로그인 체크박스, 비밀번호 수정 */}
              <AutoSignInCheckbox
                checked={isAutoLogin}
                onChange={(e) => setIsAutoLogin(e.target.checked)}
              />

              <Link href='/reset' className={styles.findLink}>
                <span>비밀번호 수정하기</span>
                <Image
                  src={ArrowLogoPath}
                  alt='비밀번호 수정 페이지로 이동하기'
                  width={11}
                  height={13}
                  className={styles.findLinkArrow}
                />
              </Link>
            </div>
            <div className={styles.buttonGroup}>
              <Button type='submit' width='100%'>
                로그인
              </Button>
              <Devider />
              <Button width='100%' secondary>
                <Link href={'/register'}>회원가입</Link>
              </Button>
              <Devider />
              <div>
                <Button onClick={signInWithGoogle}>구글 로그인</Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default LoginClient
