import React from 'react'

import Timer from '../../Timer/Timer'
import styles from './Board.scss'
import Card from '../Card/Card'

class Board extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      values: props.cards,
      cards: [],
      flippedCard: null,
      clicksOn: true,
      matches: props.cards.length / 2,
      gameOver: false,
      timerRunning: false,
    }

    this.handleCard = this.handleCard.bind(this)
    this.endTimer = this.endTimer.bind(this)
  }

  componentWillMount() {
    this.generateCards(this.state.values)
  }

  generateCards(values) {
    const newCards = []

    values.forEach((value, i) => {
      newCards.push(
        <Card
          key={`${i}${value.charCodeAt(0)}`}
          value={value}
          handleCard={this.handleCard}
        />,
      )
    })

    this.setState({ cards: newCards })
  }

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

  tryToMatch(card) {
    if (card.state.value === this.state.flippedCard.state.value) {
      card.matched()
      this.state.flippedCard.matched()
      this.checkForComplete()
      this.setState({ flippedCard: null, matches: this.state.matches - 1 })
    } else {
      this.setState({ clicksOn: false })
      setTimeout(() => {
        card.unflip()
        this.state.flippedCard.unflip()
        this.setState({ flippedCard: null, clicksOn: true })
      }, '1000')
    }
  }

  checkForComplete() {
    if (this.state.matches - 1 === 0) this.setState({ gameOver: true })
  }

  endTimer(timer) {
    timer.stop()
    this.setState({ finalTime: timer.state.secondsElapsed, timerRunning: false })
  }

  render() {
    return (
      <div>
        <Timer
          endTimer={this.endTimer}
          gameOver={this.state.gameOver}
          timerRunning={this.state.timerRunning}
        />
        <div className={styles.board}>
          { this.state.cards }
        </div>
      </div>
    )
  }
}

export default Board
