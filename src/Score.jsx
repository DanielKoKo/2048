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

    function getDigits(val) {
        return (val.toString().length);
    }
    
    return (
        <div className='score-boxes'>
            <div className='score-box'>
                <p>SCORE</p>
                <span scoreDigits={getDigits(score)}>{score}</span>
            </div>
            <div className='score-box'>
                <p>BEST</p>
                <span bestDigits={getDigits(best)}>{best}</span>
            </div>
        </div>
    )
}

export default Score