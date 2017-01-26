import React from 'react'

import styles from './Card.scss'

class Card extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      flipped: false,
    }

    this.handleFlip = this.handleFlip.bind(this)
  }

  handleFlip() {
    if (this.state.flipped) {
      this.setState({ flipped: false })
    } else {
      this.setState({ flipped: true })
    }
  }

  render() {
    if (this.state.flipped) {
      return (
        <div className={styles.flipped} onClick={this.handleFlip}>
          {this.state.value}
        </div>
      )
    }
    return (
      <div className={styles.unflipped} onClick={this.handleFlip}>
      </div>
    )
  }
}

export default Card
