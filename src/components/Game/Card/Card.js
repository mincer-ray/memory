import React from 'react'

import styles from './Card.scss'

class Card extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      flipped: false,
      matched: false,
      handleCard: props.handleCard,
    }

    this.handleClick = this.handleClick.bind(this)
    this.flip = this.flip.bind(this)
  }

  handleClick() {
    this.state.handleCard(this)
  }

  flip() {
    this.setState({ flipped: true })
  }

  unflip() {
    this.setState({ flipped: false })
  }

  matched() {
    this.setState({ matched: true })
  }

  render() {
    if (this.state.flipped || this.state.matched) {
      return (
        <div className={styles.flipped}>
          <p className={styles.face}>{this.state.value}</p>
        </div>
      )
    }
    return (
      <div
        className={styles.unflipped}
        style={{ backgroundImage: `url(${this.props.cardBack})` }}
        onClick={this.handleClick}
      />
    )
  }
}

Card.propTypes = {
  value: React.PropTypes.string.isRequired,
  handleCard: React.PropTypes.func.isRequired,
  cardBack: React.PropTypes.string.isRequired,
}

export default Card
