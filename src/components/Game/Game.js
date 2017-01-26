import React from 'react'

import Timer from '../Timer/Timer'
import Card from './Card/Card'
import styles from './Game.scss'

const http = require('http')

class Game extends React.Component {

  constructor() {
    super()
    this.state = {
      gameData: null,
    }
  }

  componentWillMount() {
    http.get('https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json', (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ gameData: JSON.parse(data) }))
    })
  }

  render() {
    if (this.state.gameData) {
      return (
        <div>
          <h1 className={styles.header}>Memory</h1>
          <button></button>
          <Card value={this.state.gameData.levels[0].cards[0]} />
        </div>
      )
    }
    return (
      <h1>Loading</h1>
    )
  }
}

export default Game
