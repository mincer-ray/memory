import React from 'react'

import styles from './styles.scss'
import Card from '../Card/Card'

class Board extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      values: props.cards,
      cards: [],
      flippedCard: null,
      clicksOn: true,
    }

    this.handleCard = this.handleCard.bind(this)
  }

  componentWillMount() {
    this.generateCards(this.state.values)
  }

  generateCards(values) {
    const newCards = []

    values.forEach((value, i) => {
      newCards.push(
        <Card
          key={i + value.charCodeAt(0)}
          value={value}
          handleCard={this.handleCard}
        />,
      )
    })

    this.setState({ cards: newCards })
  }

  handleCard(card) {
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
      this.setState({ flippedCard: null })
    } else {
      this.setState({ clicksOn: false })
      setTimeout(() => {
        card.unflip()
        this.state.flippedCard.unflip()
        this.setState({ flippedCard: null, clicksOn: true })
      }, '1000')
    }
  }

  render() {
    return (
      <div className={styles.board}>
        { this.state.cards }
      </div>
    )
  }
}

export default Board
