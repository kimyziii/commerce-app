import React from 'react'
import styles from './InfoBox.module.scss'

interface IInfoBox {
  cardClass: string
  title: string
  count: string
  icon: React.JSX.Element
}

const InfoBox = ({ cardClass, title, count, icon }: IInfoBox) => {
  return (
    <div className={styles.infoBox}>
      <div className={cardClass}>
        <h4>{title}</h4>
        <span>
          <h3>{count}</h3>
        </span>
        {icon}
      </div>
    </div>
  )
}

export default InfoBox
