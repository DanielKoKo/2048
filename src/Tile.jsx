import React from 'react';
import './Tile.css';

// color mapping for different tile values
const colorMap = {
    2: '#F0E4D9',
    4: '#EFE0C5',
    8: '#FCAE6F',
    16: '#FF9057',
    32: '#FF7456',
    64: '#F45833',
    128: '#F1CF61',
    256: '#F2CC49'
};

function Tile({ val }) {
    // background and text color based on value
    const background = colorMap[val] || '#CFC1B2';
    const text = parseInt(val) < 8 ? '#796E64' : '#F9F6F1';

    return (
        <div className='tile' style={{backgroundColor: background, color: text}}>
            {val > 0 ? val : null}
        </div>
    )
}

export default Tile
