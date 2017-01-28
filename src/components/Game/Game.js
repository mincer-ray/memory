import React from 'react'

import Board from './Board/Board'
import styles from './Game.scss'

const http = require('http')

class Game extends React.Component {

  static shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    return array
  }

  constructor() {
    super()
    this.state = {
      gameData: null,
      gameStart: false,
      deck: [],
    }

    this.newGame = this.newGame.bind(this)
  }

  componentWillMount() {
    http.get('https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json', (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ gameData: JSON.parse(data) }))
    })
  }

  newGame(e) {
    if (e.currentTarget.id === 'short') {
      const deck = this.state.gameData.levels[0].cards
      this.setState({ gameStart: true, deck: this.constructor.shuffleDeck(deck) })
    } else {
      const deck = this.state.gameData.levels[1].cards
      this.setState({ gameStart: true, deck: this.constructor.shuffleDeck(deck) })
    }
  }

  render() {
    if (this.state.gameStart) {
      return (
        <div>
          <h1 className={styles.header}>Memory</h1>
          <Board cards={this.state.deck} />
        </div>
      )
    } else if (this.state.gameData) {
      return (
        <div>
          <h1 className={styles.header}>Memory</h1>
          <button id="short" onClick={this.newGame}>Short</button>
          <button id="long" onClick={this.newGame}>Long</button>
        </div>
      )
    }
    return (
      <h1>Loading</h1>
    )
  }
}

export default Game
