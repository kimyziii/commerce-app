import React from 'react'
import styles from './Devider.module.scss'

const Devider = ({ space = 22, color = '#ccc', ...restProps }) => {
  const style = {
    marginTop: space,
    marginBottom: space,
    background: color,
  }
  return <div className={styles.line} style={style} {...restProps}></div>
}

export default Devider
