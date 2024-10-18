import React, {useState, useEffect} from 'react';
import './Board.css';

function Board() {
    const [tiles, setTiles] = useState(Array(16).fill(0));
    const [init, setInit] = useState(false);
    const validDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    let indexMap = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
    ];

    let colors = {
        2: '#F0E4D9',
        4: '#EFE0C5',
        8: '#FCAE6F',
        16: '#FF9057',
        32: '#FF7456',
        64: '#F45833',
        128: '#F1CF61',
        256: '#F2CC49'
    }
    
    useEffect(() => {
        if (!init) { initBoard(); }
        window.addEventListener('keydown', moveTiles);

        return () => {
            window.removeEventListener('keydown', moveTiles);
        }
    }, []);

    function initBoard() {
        placeRandomTile();
        placeRandomTile();
        setInit(true);
    }

    function placeRandomTile() {
        // arrow function ensures that we're working with the most current state
        // fixes issue where only 1 tile is generated upon startup
        setTiles((prevTiles) => {
            let newTile;

            do {
                newTile = Math.floor(Math.random() * 17);
            } while (prevTiles[newTile] !== 0);
    
            const newTiles = [...prevTiles];

            // generate either 2 or 4 if board contains a 4, otherwise generate 2
            if (tiles.includes(4)) 
                newTiles[newTile] = Math.floor(Math.random() < 0.5 ? 2 : 4);
            else 
                newTiles[newTile] = 2;
            
            return newTiles;
        })
    }

    function moveTiles(e) {
        const direction = e.key;

        // return if input isn't an arrow key
        if (!validDirections.includes(direction)) { return; }

        const isVertical = direction === 'ArrowUp' || direction === 'ArrowDown';
        const reverseStack = direction === 'ArrowDown' || direction === 'ArrowRight';

        setTiles((prevTiles) => {
            const newTiles = [...prevTiles];

            for (let i = 0; i < 4; i++) {
                let stack = [];

                for (let j = 0; j < 4; j++) {
                    const curr = isVertical ? indexMap[j][i] : indexMap[i][j];

                    // only add tiles with values to stack
                    if (newTiles[curr] > 0)
                        stack.push(newTiles[curr]);
                }

                stack = stack.reverse();

                // reverse the stack if going down
                if (reverseStack)
                    stack = stack.reverse();

                combine(i, direction, stack, newTiles);
            }

            return newTiles;
        })

        placeRandomTile();
    }

    function combine(i, direction, stack, newTiles) {
        let res = [];
        
        // combine values
        while (stack.length > 0) {
            if (stack.length > 1 && (stack[stack.length - 1] === stack[stack.length - 2])) {
                const val = stack.pop() * 2;
                stack.pop();
                res.push(val);
            }
            else {
                res.push(stack.pop());
            }
        }

        // fill remaining spaces with 0s
        const rem_len = 4 - res.length;
        res = res.concat(Array(rem_len).fill(0))

        // flip stack if direction is down or right
        if (direction === 'ArrowDown' || direction === 'ArrowRight')
            res = res.reverse();

        // fill row/column with combined values
        (direction === 'ArrowUp' || 
         direction === 'ArrowDown') ? fill(i, 'vertical', res, newTiles) :
                                      fill(i, 'horizontal', res, newTiles);
    }

    function fill(i, direction, res, newTiles) {
        for (let j = 0; j < 4; j++) {
            const dest = direction === 'vertical' ? indexMap[j][i] : indexMap[i][j];
            newTiles[dest] = res[j];
        }
    }

    function renderTile(i) {
        // background and text color based on value
        const background = colors[tiles[i]] || '#CFC1B2';
        const text = parseInt(tiles[i]) < 8 ? '#796E64' : '#F9F6F1';

        return (
            <div className="tile" style={{backgroundColor: background, color: text}}>
                {tiles[i] > 0 ? tiles[i] : null}
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
