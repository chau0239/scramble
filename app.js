/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  if (!src) return '';
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

function App() {

  let words = [
    "hello", "world", "python", "programming", "language", "computer", "science", "algorithm", "data", "structure", "learning"
  ];

  /////// Data
  const [points, setPoints] = React.useState(0)
  // Strike variable
  const [strikes, setStrikes] = React.useState(0)

  // user input
  const [userInput, setUserInput] = React.useState('')
  // isCorrect variable
  const [isCorrect, setIsCorrect] = React.useState(null)
  // index based on turns of scrambled word 
  const [currentIndex, setCurrentIndex] = React.useState(0)
  // passes variable
  const MAX_PASSES = 3
  const MAX_STRIKES = 3
  const [passes, setPasses] = React.useState(MAX_PASSES)
  const [shuffledWord, setShuffledWord] = React.useState(shuffle(words[currentIndex]));

  const [isGameOver, setIsGameOver] = React.useState(false)

  const handleOnChange = (event) => {

    if (event.key === 'Enter') {

      setUserInput('')
      setCurrentIndex(prev => prev + 1)

      if (event.target.value === words[currentIndex]) {
        // if answer is correct
        setIsCorrect(true)
        setPoints(prevPoints => prevPoints + 1);

      } else {
        // if incorrect
        if (strikes >= MAX_STRIKES) {
          // if no more passes 
          setIsGameOver(true)

        } else {
          setIsCorrect(false)
          setStrikes(prevStrikes => prevStrikes + 1);
        }
      }
    } else {
      setUserInput(event.target.value)
    }
  }

  React.useEffect(() => {
    setShuffledWord(shuffle(words[currentIndex]));
  }, [currentIndex]);

  const resetEverything = () => {
    setCurrentIndex(0)
    setIsCorrect(null)
    setIsGameOver(false)
    setPasses(MAX_PASSES)
    setPoints(0)
    setStrikes(0)
  }

  const onPassClick = () => {
    if (passes > 0) {
      setPasses(prevPass => prevPass - 1)
      setCurrentIndex(prevIndex => prevIndex + 1)
      setUserInput('')
    }
  }

  // Initialize game state from local storage
  React.useEffect(() => {
    const gameState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (gameState) {
      setPoints(gameState.points);
      setStrikes(gameState.strikes);
      setPasses(gameState.passes);
      setCurrentIndex(gameState.currentIndex);
    }
  }, []);

  // Save game state to local storage
  React.useEffect(() => {
    localStorage.setItem('scrambleGameState', JSON.stringify({
      points,
      strikes,
      passes,
      currentIndex
    }));
  }, [points, strikes, passes, currentIndex]);


  return (
    <div className="container">
      <h1>Scramble</h1>
      {
        isGameOver
          ?
          <div>
            <h2>Game Over! No passes left</h2>
            <button onClick={() => { resetEverything() }}>Restart</button>
          </div>
          :
          <div>
            <p>{currentIndex} out of {words.length}</p>
            <h1>{shuffledWord}</h1>
            {
              currentIndex == words.length ?
                <div>
                  <p>Congratulations</p>
                  <button onClick={resetEverything}> Play again</button>
                </div>
                :
                <div>
                  {isCorrect === true && <p style={{ color: "green" }}>Right Answer</p>}
                  {isCorrect === false && <p style={{ color: "red" }}>Wrong Answer</p>}
                  <input type="text" placeholder="write your guess" onKeyDown={handleOnChange} onChange={(event) => setUserInput(event.target.value)} value={userInput} ></input>
                  <button onClick={onPassClick}>Passes Left: {passes}</button>
                </div>
            }
            <p>Points: {points}</p>
            <p>Strikes: {strikes}</p>

          </div>
      }
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
