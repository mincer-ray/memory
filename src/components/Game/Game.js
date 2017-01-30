import React from 'react'

import Board from './Board/Board'
import Scores from '../Scores/Scores'
import styles from './Game.scss'

const http = require('http')
const firebase = require('firebase')
// init firebase
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
  // static because doesn't use this
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
      cardBack: '',
      deck: [],
    }

    this.newGame = this.newGame.bind(this)
    this.resetGame = this.resetGame.bind(this)
    this.updateCard = this.updateCard.bind(this)
  }
  // fetches the gamd data. TODO add a spinner while waiting for response
  componentWillMount() {
    http.get('https://web-code-test-dot-nyt-games-prd.appspot.com/cards.json', (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ gameData: JSON.parse(data) }))
    })
    this.getScores()
  }
  // seperated firebase gets to keep code clean
  getScores() {
    http.get('https://nytmemory.firebaseio.com/scores/short.json?orderBy="time"&limitToFirst=5&print=pretty',
    (response) => {
      response.setEncoding('utf8')
      response.on('data', data => this.setState({ shortScores: JSON.parse(data) }))
    })
    http.get('https://nytmemory.firebaseio.com/scores/long.json?orderBy="time"&limitToFirst=5&print=pretty',
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
  // saves reference to path of user image on local machine
  updateCard(e) {
    this.setState({ cardBack: window.URL.createObjectURL(e.target.files[0]) })
  }

  resetGame() {
    this.setState({ gameStart: false })
    this.getScores()
  }

  render() {
    if (this.state.gameStart) {
      // render board once game has been started
      return (
        <div className={styles.gameOn}>
          <Board
            cards={this.state.deck}
            database={database}
            gameType={this.state.gameType}
            cardBack={this.state.cardBack}
            resetGame={this.resetGame}
          />
        </div>
      )
    } else if (this.state.gameData) {
      // main menu
      return (
        <div className={styles.container}>
          <div className={styles.highScores}>
            <p className={styles.text}>High Score Boards</p>
            <Scores scores={this.state.shortScores} title={'Short Scores'} />
            <Scores scores={this.state.longScores} title="Long Scores" />
          </div>
          <div className={styles.game}>
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
          </div>
          <div className={styles.customCard}>
            <p className={styles.text}>Upload a custom card</p>
            <img className={styles.cardPreview} src={this.state.cardBack} alt="" />
            <label>
              <input type="file" onChange={this.updateCard} />
              Choose a file
            </label>
          </div>
        </div>
      )
    }
    // game data not yet recieved
    return (
      <div className={styles.game}>
        <h1 className={styles.header}>Loading</h1>
      </div>
    )
  }
}

export default Game
