import React, {useState, useContext, useEffect} from 'react';
import Cookies from 'universal-cookie';
import { GameContext } from './App';
import './Score.css';

function Score() {
    const { score } = useContext(GameContext);
    const cookies = new Cookies(null, { path: '/' });
    const [best, setBest] = useState(parseInt(cookies.get('bestScore')) || 0);

    useEffect(() => {
        const cookieScore = parseInt(cookies.get('bestScore')) || -1;

        if (score > cookieScore) {
            cookies.set('bestScore', score);
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