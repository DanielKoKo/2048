import React, {useState, useContext, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { GameContext } from './App';
import './Score.css';

function Score() {
    const { score } = useContext(GameContext);
    const [cookie, setCookie] = useCookies(['bestScore']);
    const [best, setBest] = useState(cookie.bestScore || 0);

    useEffect(() => {
        if (score > best) {
            setCookie('bestScore', score);
            setBest(score);
        }
    }, [score])
    
    return (
        <div className='score-boxes'>
            <div className='score-box'>
                <p>SCORE</p>
                <span>{score}</span>
            </div>
            <div className='score-box'>
                <p>BEST</p>
                <span>{best}</span>
            </div>
        </div>
    )
}

export default Score