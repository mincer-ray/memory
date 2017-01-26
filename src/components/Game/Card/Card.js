import React from 'react'

class Card extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      flipped: false,
    }
  }
}
