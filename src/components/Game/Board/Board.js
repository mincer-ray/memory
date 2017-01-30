import React from 'react'

import Timer from '../../Timer/Timer'
import styles from './Board.scss'
import Card from '../Card/Card'

class Board extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      cards: [],
      flippedCard: null,
      clicksOn: true,
      matches: props.cards.length / 2,
      attempts: 0,
      gameOver: false,
      timerRunning: false,
    }

    this.handleCard = this.handleCard.bind(this)
    this.endTimer = this.endTimer.bind(this)
    this.recordScore = this.recordScore.bind(this)
    this.resetGame = this.resetGame.bind(this)
  }
  // create card components before render
  componentWillMount() {
    this.generateCards(this.props.cards)
  }

  generateCards(values) {
    const newCards = []

    values.forEach((value, i) => {
      newCards.push(
        <Card
          key={`${i}${value.charCodeAt(0)}`}
          value={value}
          handleCard={this.handleCard}
          cardBack={this.props.cardBack}
        />,
      )
    })

    this.setState({ cards: newCards })
  }
  // callback is passed to each card enabling card flips and saving references
  handleCard(card) {
    if (this.state.timerRunning === false) this.setState({ timerRunning: true })
    if (this.state.clicksOn === false) return
    if (this.state.flippedCard) {
      card.flip()
      this.tryToMatch(card)
    } else if (card.state.flipped === false) {
      card.flip()
      this.setState({ flippedCard: card })
    }
  }
  // compares a 2nd flipped card to the flipped card saved in Board's state
  tryToMatch(card) {
    if (card.state.value === this.state.flippedCard.state.value) {
      card.matched()
      this.state.flippedCard.matched()
      this.checkForComplete()
      this.setState({
        flippedCard: null,
        matches: this.state.matches - 1,
        attempts: this.state.attempts + 1,
      })
    } else {
      this.setState({ clicksOn: false })
      // game pauses a second on false matches to give the player a moment to remember
      setTimeout(() => {
        card.unflip()
        this.state.flippedCard.unflip()
        this.setState({
          flippedCard: null,
          clicksOn: true,
          attempts: this.state.attempts + 1,
        })
      }, '1000')
    }
  }
  // checks to see if this match will be the last one
  checkForComplete() {
    if (this.state.matches - 1 === 0) this.setState({ gameOver: true })
  }

  endTimer(finalTime) {
    this.setState({ finalTime, timerRunning: false })
  }

  resetGame() {
    // no reseting game unless all setTimeouts are complete to avoid errors
    if (this.state.clicksOn) {
      this.props.resetGame()
    }
  }

  recordScore() {
    // submit score TODO custom modal or some improved form for input of high score name
    const name = prompt('enter name for high score').slice(0, 10)
    this.props.database.ref(`scores/${this.props.gameType}`).push({
      name,
      time: this.state.finalTime,
      attempts: this.state.attempts,
    })

    this.props.resetGame()
  }
  // quick conditional to only render submit score button if game has ended
  submitScore() {
    if (this.state.gameOver) {
      return (
        <button className={styles.button} onClick={this.recordScore}>Submit Score</button>
      )
    }
    return (
      <div />
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <Timer
          endTimer={this.endTimer}
          gameOver={this.state.gameOver}
          timerRunning={this.state.timerRunning}
        />
        <p className={styles.text}>{this.state.attempts} attempted matches</p>
        <div className={styles.board}>
          { this.state.cards }
        </div>
        { this.submitScore() }
        <button className={styles.button} onClick={this.resetGame}>Reset</button>
      </div>
    )
  }
}

Board.propTypes = {
  cards: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  cardBack: React.PropTypes.string.isRequired,
  database: React.PropTypes.object.isRequired,
  gameType: React.PropTypes.string.isRequired,
  resetGame: React.PropTypes.func.isRequired,
}

export default Board
