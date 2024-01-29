import React from 'react'
import styles from './Devider.module.scss'

interface IDeviderProps {
  space?: number
  color?: string
  [x: string]: any
}

const Devider = ({
  space = 22,
  color = '#ccc',
  ...restProps
}: IDeviderProps) => {
  const style = {
    marginTop: space,
    marginBottom: space,
    background: color,
  }
  return <div className={styles.line} style={style} {...restProps}></div>
}

export default Devider
