import React, {useState} from 'react';
import './Board.css';

function Board() {
    const [tiles, setTiles] = useState(Array(16).fill(''));
    
    let colors = {
        '2': '#F0E4D9',
        '4': '#EFE0C5',
        '8': '#FCAE6F',
        '16': '#FF9057',
        '32': '#FF7456'
    }

    function renderTile(i) {
        // background and text color based on value
        const background = colors[tiles[i]] || '#CFC1B2';
        const text = parseInt(tiles[i]) < 8 ? '#796E64' : '#F9F6F1';

        return (
            <div className="tile" style={{backgroundColor: background, color: text}}>
                {tiles[i]}
            </div>
        )
    }

    return (
        <div className='board'>
            {tiles.map((_, i) => renderTile(i))}
        </div>
    )
}

export default Board
