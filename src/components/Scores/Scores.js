import React from 'react'

import styles from './Scores.scss'
import { formatTime } from '../Timer/Timer'

export const sortScores = (scores) => {
  const scoreArray = []
  Object.keys(scores).forEach(score => scoreArray.push(Object.assign(scores[score], { id: score })))
  return scoreArray.sort((a, b) => a.time - b.time)
}

const Score = ({ data = {} }) => (
  <tr>
    <td>{data.name}</td>
    <td>{data.attempts}</td>
    <td>{formatTime(data.time)}</td>
  </tr>
)

const Scores = ({ scores = [], title = '' }) => {
  const formattedScores = []
  sortScores(scores).forEach(score => formattedScores.push(<Score key={score.id} data={score} />))
  return (
    <table className={styles.scores}>
      <caption className={styles.text}>{title}</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Attempts</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {formattedScores}
      </tbody>
    </table>
  )
}

export default Scores
