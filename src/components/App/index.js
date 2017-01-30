import React from 'react'
import Game from '../Game/Game'

import styles from './index.scss'

const App = () => (
  <div className={styles.app}>
    <h1 className={styles.header}>Memory</h1>
    <Game />
  </div>
)

export default App
