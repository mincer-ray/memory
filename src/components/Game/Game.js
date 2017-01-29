import React from 'react'

import Board from './Board/Board'
import Scores from '../Scores/Scores'
import styles from './Game.scss'

const http = require('http')
const firebase = require('firebase')

const config = {
  apiKey: 'AIzaSyDmc8sMfqvgk9S1xfenmUyAugxTPxf_ymY',
  authDomain: 'nytmemory.firebaseapp.com',
  databaseURL: 'https://nytmemory.firebaseio.com',
  storageBucket: 'nytmemory.appspot.com',
  messagingSenderId: '665490951583',
}

firebase.initializeApp(config)

const database = firebase.database()

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
      highScores: [],
      gameStart: false,
      deck: [],
    }

    this.newGame = this.newGame.bind(this)
    this.resetGame = this.resetGame.bind(this)
  }

  componentWillMount() {
    http.get('https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json', (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ gameData: JSON.parse(data) }))
    })
    this.getScores()
  }

  getScores() {
    http.get('https://nytmemory.firebaseio.com/scores/short.json?orderBy="time"&limitToLast=5&print=pretty',
    (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ shortScores: JSON.parse(data) }))
    })
    http.get('https://nytmemory.firebaseio.com/scores/long.json?orderBy="time"&limitToLast=5&print=pretty',
    (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ longScores: JSON.parse(data) }))
    })
  }

  newGame(e) {
    if (e.currentTarget.id === 'short') {
      const deck = this.state.gameData.levels[0].cards
      this.setState({ gameStart: true, deck: this.constructor.shuffleDeck(deck), gameType: 'short' })
    } else {
      const deck = this.state.gameData.levels[1].cards
      this.setState({ gameStart: true, deck: this.constructor.shuffleDeck(deck), gameType: 'long' })
    }
  }

  resetGame() {
    this.setState({ gameStart: false })
    this.getScores()
  }

  render() {
    if (this.state.gameStart) {
      return (
        <div className={styles.game}>
          <h1 className={styles.header}>Memory</h1>
          <Board cards={this.state.deck} database={database} gameType={this.state.gameType} />
          <button className={styles.button} onClick={this.resetGame}>Reset</button>
        </div>
      )
    } else if (this.state.gameData) {
      return (
        <div className={styles.game}>
          <h1 className={styles.header}>Memory</h1>
          <p className={styles.text}>New Game</p>
          <button
            className={styles.button}
            id="short"
            onClick={this.newGame}
          >Short</button>
          <button
            className={styles.button}
            id="long"
            onClick={this.newGame}
          >Long</button>
        <p className={styles.text}>Short Scores</p>
        <Scores scores={this.state.shortScores} />
        <p className={styles.text}>Long Scores</p>
        <Scores scores={this.state.longScores} />
        </div>
      )
    }
    return (
      <div className={styles.game}>
        <h1 className={styles.header}>Loading</h1>
      </div>
    )
  }
}

export default Game
