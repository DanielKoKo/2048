import React, { createContext, useState } from 'react';
import TopTab from './TopTab';
import Board from './Board';
import './App.css';

function App() {
  const [isReset, setIsReset] = useState(false);

  function handleReset(state) {
    setIsReset(state);
  }

  return (
    <>
      <TopTab handleReset={handleReset}/>
      <Board isReset={isReset} handleReset={handleReset}/>
    </>
  )
}

export default App
