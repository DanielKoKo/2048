import React, { createContext, useState } from 'react';
import TopTab from './TopTab';
import Board from './Board';
import './App.css';

export const GameContext = createContext();

function App() {
  const [isReset, setIsReset] = useState(false);

  function handleReset(state) {
    setIsReset(state);
  }

  return (
    <>
      <GameContext.Provider value={{ isReset, handleReset }}>
        <TopTab/>
        <Board/>
      </GameContext.Provider>
    </>
  )
}

export default App
