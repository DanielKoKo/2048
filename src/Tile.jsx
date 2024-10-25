import React from 'react';
import './Tile.css';

// color mapping for different tile values
const colorMap = {
    0: '#CFC1B2',
    2: '#EEE4DA',
    4: '#EDE0C8',
    8: '#F2B179',
    16: '#F59563',
    32: '#F67C5F',
    64: '#F65E3B',
    128: '#EDCF72',
    256: '#EDCC61',
    512: '#EDC850',
    1024: '#EDC53F',
    2048: '#EDC22E'
};

function Tile({ val, isNew }) {
    // background and text color based on value
    const backgroundColor = colorMap[val] || '#3C3A32';
    const textColor = parseInt(val) < 8 ? '#796E64' : '#F9F6F1';

    return (
        <div className='tile' style={{backgroundColor: backgroundColor, color: textColor}}>
            {val > 0 ? val : null}
        </div>
    )
}

export default Tile