'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './Navbar'
import styles from './NavbarProvider.module.scss'

const NavbarProvider = ({ children }) => {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      {isAdmin ? (
        <div className={styles.admin}>
          <div className={styles.navbar}>
            <Navbar />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default NavbarProvider
