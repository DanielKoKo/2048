import React, {useContext} from 'react';
import Score from './Score';
import { GameContext } from './App';
import './TopTab.css';

function TopTab() {
    const { handleReset } = useContext(GameContext);

    function onReset() {
        handleReset(true);
    }

    return (
        <div className='rows'>
            <div className='title-and-scores'>
                <h1>2048</h1>
                <Score/>
            </div>
            <div className='new-game-row'>
                <p>Join the numbers and get to the <strong>2048</strong> tile!</p>
                <button onClick={() => {onReset()}}>New Game</button> 
            </div>
        </div>
    )
}

export default TopTab
