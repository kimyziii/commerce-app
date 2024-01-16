'use client'
import Button from '@/components/button/Button'
import Heading from '@/components/haeding/Heading'
import Input from '@/components/input/Input'
import Loader from '@/components/loader/Loader'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from './Reset.module.scss'

import ArrowLogoPath from '@/assets/arrow.svg'

const ResetClient = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const resetPassword = (e) => {
    e.preventDefault()
    setIsLoading(true)
  }

  return (
    <>
      {isLoading && <Loader />}

      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.form}>
            <Heading
              title='비밀번호 업데이트'
              subtitle='이메일 주소를 입력해 주세요'
            />
            <form onSubmit={resetPassword}>
              <Input
                type='text'
                placeholder='Email'
                required
                value={email}
                className={styles.control}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <Button type='submit'>업데이트</Button>
              </div>

              <div className={styles.links}>
                <Link href='/login'>
                  <div className={styles.link}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span>로그인</span>
                    </div>
                    <Image
                      src={ArrowLogoPath}
                      width={11}
                      height={13}
                      alt='로그인 페이지로 이동하기'
                    />
                  </div>
                </Link>
                <Link href='/register'>
                  <div className={styles.link}>
                    <div>회원가입</div>
                    <Image
                      src={ArrowLogoPath}
                      width={11}
                      height={13}
                      alt='회원가입 페이지로 이동하기'
                    />
                  </div>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ResetClient
