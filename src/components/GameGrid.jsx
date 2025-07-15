import {useState, useEffect} from 'react'
import { checkWord, createGameSession } from '../services/api'
import './GameGrid.css'

const MAX_ATTEMPTS = 6;

export default function GameGrid({session, setSession}) {
  
  const wordLength = session.wordLenght;
  const [attempts, setAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState('');
  const [error, setError] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); 

  useEffect(() => {
    setAttempts([]);
    setCurrentAttempt('');
    setError('');
    setGameOver(false);
    setGameResult(null);
  }, [session]);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length <= wordLength) {
      setCurrentAttempt(value);
      setError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentAttempt.length !== wordLength) {
      setError(`The word must have ${wordLength} letters`);
      return;
    }
    try {
      const result = await checkWord(session.sessionId, currentAttempt);
      setAttempts((prev) => [...prev, result]);
      setCurrentAttempt('');
      setError('');
      const guessedCorrectly = result.every((r) => r.solution === 'correct');
      if (guessedCorrectly) {
        setGameOver(true);
        setGameResult('win');
      } else if (attempts.length + 1 === MAX_ATTEMPTS) {
        setGameOver(true);
        setGameResult('lose');
      }

    } catch (error) {
      if (err.response?.status === 400) {
        setError('Invalid word');
      } else {
        setError('Error verifying the word');
      }
    }
  };

  const onRestart = async () => {
    const newSession = await createGameSession(session.difficulty.id);
    setSession(newSession);
  }

    const getColor = (s) => {
    if (s === 'correct') return '#267723ff';
    if (s === 'elsewhere') return '#cebe2efd';
    if (s === 'absent') return '#686868ff';
    return '#686868ff';
  };

  return (
    <div>
      <div className="grid-container">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const row = attempts[rowIndex] || [];
          const isCurrent = rowIndex === attempts.length;

          return (
            <div className="row" key={rowIndex}>
              {Array.from({ length: wordLength }).map((_, colIndex) => {
                let letter = '';
                let color = 'white';

                if (isCurrent) {
                  letter = currentAttempt[colIndex] || '';
                } else if (row[colIndex]) {
                  letter = row[colIndex].letter;
                  color = getColor(row[colIndex].solution);
                }

                return (
                  <div
                    key={colIndex}
                    style={{
                      backgroundColor: color,
                      border: '3px solid black',
                      borderRadius: '5px',
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '40px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className='form-container'>
        <input
          type="text"
          value={currentAttempt}
          onChange={handleChange}
          maxLength={wordLength}
          style={{ fontSize: '25px', width: '150px', textAlign: 'center', textTransform: 'uppercase' }}
          />
        <button type="submit">Guess</button>
      </form>

      {error && <p style={{ color: 'red', textAlign:'center', fontSize:'20px' }}>{error}</p>}

      {gameOver && (
       <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '24px' }}>
        {gameResult === 'win' ? (
          <p style={{ color: 'green', fontWeight: 'bold' }}>You won!</p>
        ) : (
          <p style={{ color: 'red', fontWeight: 'bold' }}>You lose</p>
        )}
        <button onClick={() => onRestart()} style={{height: '60px', width: '150px', fontSize: '20px'}}>
          Play Again
        </button>
        </div>
      )}
    </div>  
  );
}