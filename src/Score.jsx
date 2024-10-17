import React, {useState} from 'react';
import './Score.css';

function Score() {
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);

    return (
        <div>
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
        </div>
    )
}

export default Score