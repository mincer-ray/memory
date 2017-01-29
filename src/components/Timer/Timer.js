import React from 'react'

import styles from './Timer.scss'

export const formatTime = (time) => {
  if (time < 0) return '--:--'
  const h = Math.floor(time / 3600)
  const m = Math.floor((time % 3600) / 60)
  const mm = m < 10 ? `0${m}` : m
  const s = time % 60
  const ss = s < 10 ? `0${s}` : s
  if (h > 0) return [h, mm, ss].join(':')
  return `${m}:${ss}`
}

const Timer = ({ time = 0 }) => (
  <div className={styles.timer}>
    {formatTime(time)}
  </div>
)

Timer.propTypes = {
  time: React.PropTypes.number,
}

Timer.defaultProps = {
  time: 0,
}

class TimerContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      secondsElapsed: 0,
      timerRunning: false,
    }

    this.endTimer = props.endTimer
  }

  componentWillReceiveProps(newProps) {
    if (newProps.gameOver && this.state.timerRunning) {
      this.endTimer(this.state.secondsElapsed)
      this.stop()
      this.setState({ timerRunning: false })
    } else if (newProps.timerRunning && !this.state.timerRunning) {
      this.start()
      this.setState({ timerRunning: true })
    }
  }

  componentWillUnmount() {
    this.stop()
  }

  start() {
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  tick() {
    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1,
    })
  }

  render() {
    return (
      <Timer time={this.state.secondsElapsed} />
    )
  }
}

TimerContainer.propTypes = {
  endTimer: React.PropTypes.func,
}

TimerContainer.defaultProps = {
  endTimer: () => {},
}

export default TimerContainer
