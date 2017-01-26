import React from 'react'

import Timer from '../Timer/Timer'
import styles from './Game.scss'

const http = require('http')

class Game extends React.Component {

  constructor() {
    super()
    this.state = {
      gameData: {},
    }
  }

  componentDidMount() {
    http.get('https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json', (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ gameData: data }))
    })
  }

  render() {
    return (
      <div>
        <h1 className={styles.header}>Memory</h1>
        <div className={styles.placeholder}>Let the games begin (here).</div>
      </div>
    )
  }
}

export default Game
