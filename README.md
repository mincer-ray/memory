# Memory

Memory is a web game built with React using the NYT kyt toolkit. The app can be used by downloading the .zip, running `npm run dev`, and viewing `http://localhost:3000/`

## Implementation

Memory was created using pure React components. Initially I had considered using Redux to handle app state but decided that it would be overkill for such a small project. The components handle their own state and share information though a small collection of callbacks.

### Overview

The game consists of a single Game component that handles the starting, and reseting of the game. It also handles the initial setup and the fetching of game JSON data from the provided URL. The Game component also handles config for the firebase high score database and the custom card back loading.

When a new game is created, the Game component displays a new Board component which is passed an array of card symbols depending on which length game was chosen. The Board component handles the flow of a single game and controls the timer and score submission. The Board component renders a set of Card components.

The Card component contains state for a single card, such as whether or not it is flipped and if it has been matched to another card yet. Cards that have been matched are rendered inactive to remove them from gameplay.

### Callbacks

Board passes the `handleCard` callback to every Card in order for Board to compare and control their behavior. `handleCard` is attached to every card with a click event listener. When a card runs `handleCard` it passes in `this` so that Board can call its `flip` function. If no card is currently flipped, Board stores a reference to the card and the game continues. If there is already a flipped card, Board will `tryToMatch` the cards.

```javascript
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
```

## Features

### High Score

Memory features a high score board for both the long and short games. The scores are saved in a Firebase database. Accessing the database can done with RESTful API calls. The 5 shortest times are fetched and displayed on the main menu.

High scores are displayed with a Scores functional component that renders them into a `table` format.

GET scores in Game
```javascript
getScores() {
  http.get('https://nytmemory.firebaseio.com/scores/short.json?orderBy="time"&limitToFirst=5&print=pretty',
  (response) => {
    response.setEncoding('utf8')
    response.on('data', data => this.setState({ shortScores: JSON.parse(data) }))
  })
}
```
adding new scores to database in Board
```javascript
recordScore() {
  const name = prompt('enter name for high score').slice(0, 10)
  this.props.database.ref(`scores/${this.props.gameType}`).push({
    name,
    time: this.state.finalTime,
    attempts: this.state.attempts,
  })
}
```

### Custom Card

Custom card back images can be used by the player. The card back can be an image located on the users local machine. The image is added with a file input html field, and a URL to that file is created with `createObjectURL` The card image is recorded to the state of the Game component then passed through Board into Card as props.

```javascript
updateCard(e) {
  this.setState({ cardBack: window.URL.createObjectURL(e.target.files[0]) })
}
```

## Moving Forward

I'd like to improve the stylesheets in the future. While the game looks presentable, time prevented me from making the high score boards nice and neat. Overall layout could use improvement. I'd like to add a cookie as well so users could leave and come back to an open game.
