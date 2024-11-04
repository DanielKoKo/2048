import React, { createContext, useState } from 'react';
import TopTab from './TopTab';
import Board from './Board';
import './App.css';

export const GameContext = createContext();

function App() {
  const [isReset, setIsReset] = useState(false);
  const [score, setScore] = useState(0);

  function handleReset(state) {
    setIsReset(state);
  }

  function handleScoreChange(pendingScore) {
    setScore(pendingScore);
  }

  return (
    <>
      <GameContext.Provider value={{ isReset, handleReset, score, handleScoreChange }}>
        <div className='container'>
          <TopTab/>
          <Board/>
        </div>
      </GameContext.Provider>
    </>
  )
}

export default App
