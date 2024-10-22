import React, {useState, useContext} from 'react';
import { useCookies } from 'react-cookie';
import { GameContext } from './App';
import './Score.css';

function Score() {
    const { score } = useContext(GameContext);
    const [cookie, setCookie] = useCookies(['best']);
    const [best, setBest] = useState(cookie.best || 0);

    function renderBest() {
        if (score > best) {
            setCookie('best', score);
            setBest(score);
        }

        return (
            <span>{best}</span>
        )
    }
    
    return (
        <div className='score-boxes'>
            <div className='score-box'>
                <p>SCORE</p>
                <span>{score}</span>
            </div>
            <div className='score-box'>
                <p>BEST</p>
                <span>{renderBest()}</span>
            </div>
        </div>
    )
}

export default Score