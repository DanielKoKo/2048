import React, {useState, useEffect, memo} from 'react';
import './Board.css';

function Board() {
    const [tiles, setTiles] = useState(Array(16).fill(''));
    const [initialized, setInitialized] = useState(false);

    let colors = {
        '2': '#F0E4D9',
        '4': '#EFE0C5',
        '8': '#FCAE6F',
        '16': '#FF9057',
        '32': '#FF7456'
    }
    
    useEffect(() => {
        if (!initialized) {
            placeRandomTile('2');
            placeRandomTile('2');
            setInitialized(true);
        }

        window.addEventListener('keydown', moveTiles);

        return () => {
            window.removeEventListener('keydown', moveTiles);
        }
    }, []);

    function placeRandomTile(val) {
        // arrow function ensures that we're working with the most current state
        // fixes issue where only 1 tile is generated upon startup
        setTiles((prevTiles) => {
            let newTile;

            do {
                newTile = Math.floor(Math.random() * 17);
            } while (prevTiles[newTile] !== '');
    
            const newTiles = [...prevTiles];
            newTiles[newTile] = val;
            return newTiles;
        })
    }

    function moveTiles(e) {
        const direction = e.key;

        
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
