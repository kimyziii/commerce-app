'use client'
import React, { useCallback, useEffect, useState } from 'react'
import sliderData from './SliderData'
import styles from './Slider.module.scss'

import { AiOutlineArrowLeft } from 'react-icons/ai'
import { AiOutlineArrowRight } from 'react-icons/ai'
import Image from 'next/image'
import classNames from 'classnames'

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderLength = sliderData.length

  const INTERVAL_TIME = 5000 // 5초

  const nextSlide = useCallback(() => {
    setCurrentSlide(currentSlide === sliderLength - 1 ? 0 : currentSlide + 1)
  }, [currentSlide, sliderLength])

  const prevSlide = useCallback(() => {
    setCurrentSlide(currentSlide === 0 ? sliderLength - 1 : currentSlide - 1)
  }, [currentSlide, sliderLength])

  useEffect(() => {
    const itv = setInterval(nextSlide, INTERVAL_TIME)
    return () => {
      clearInterval(itv)
    }
  }, [nextSlide])

  return (
    <div className={styles.slider}>
      <AiOutlineArrowLeft
        className={classNames(styles.arrow, styles.prev)}
        onClick={prevSlide}
      />
      <AiOutlineArrowRight
        className={classNames(styles.arrow, styles.next)}
        onClick={nextSlide}
      />

      {sliderData.map((slider, idx) => {
        const { image, heading } = slider

        return (
          <div
            key={heading}
            className={
              idx === currentSlide
                ? `${styles.slide} ${styles.current}`
                : `{styles.slide}`
            }
          >
            {idx === currentSlide ? (
              <Image src={image} alt={heading} fill />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default Slider
