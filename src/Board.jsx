import React, {useState, useEffect} from 'react';
import './Board.css';

// map of index positions for the tiles on the board
const indexMap = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15]
];

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
}

function Board() {
    const [tiles, setTiles] = useState(Array(16).fill(0));
    const [isInitialized, setIsInitialized] = useState(false);
    const validDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    useEffect(() => {
        if (!isInitialized) { initBoard(); }

        window.addEventListener('keydown', handleTileMovement);

        // clean up
        return () => { window.removeEventListener('keydown', handleTileMovement); }
    }, []);

    /*
        initializes board with 2 random tiles with value 2
    */
    function initBoard() {
        generateTile();
        generateTile();

        setIsInitialized(true);
    }

    /*
        places a new random tile (either 2 or 4) on the board
        - will only place 4 when there's already a 4 on the board
    */
    function generateTile() {
        // arrow function ensures that we're working with the most current state
        // fixes issue where only 1 tile is generated upon startup
        setTiles((prevTiles) => {
            let newTile;

            // generate a random tile
            do {
                newTile = Math.floor(Math.random() * 16);
            } while (prevTiles[newTile] !== 0); // if new tile is occupied, regenerate
    
            console.log('new tile at: ' + newTile);
            const newTiles = [...prevTiles];

            // generate either 2 or 4 if board contains a 4, otherwise generate 2
            if (tiles.includes(4)) 
                newTiles[newTile] = Math.floor(Math.random() < 0.5 ? 2 : 4);
            else 
                newTiles[newTile] = 2;
            
            return newTiles;
        })
    }

    /*
        handles tile movement based on arrow key input
    */
    function handleTileMovement(e) {
        const direction = e.key;

        // return if input isn't an arrow key
        if (!validDirections.includes(direction)) { return; }

        const isVertical = direction === 'ArrowUp' || direction === 'ArrowDown';
        const reverseStack = direction === 'ArrowDown' || direction === 'ArrowRight';

        setTiles((prevTiles) => {
            const newTiles = [...prevTiles]; 

            // iterate through rows or columns based on direction
            for (let i = 0; i < 4; i++) {
                let stack = []; // store entire row/column in stack

                for (let j = 0; j < 4; j++) {
                    const curr = isVertical ? indexMap[j][i] : indexMap[i][j];

                    // only add tiles with values to stack
                    if (newTiles[curr] > 0)
                        stack.push(newTiles[curr]);
                }

                stack = stack.reverse();

                // reverse the stack if going down/right
                if (reverseStack)
                    stack = stack.reverse();

                combineTiles(i, direction, stack, newTiles);
            }

            // if board is unchanged (i.e. not a valid move), don't generate new tile
            if (JSON.stringify(prevTiles) !== JSON.stringify(newTiles))
                generateTile();

            return newTiles;
        })
    }

    /*
        shifts the current row/column by joining values 
    */
    function combineTiles(i, direction, stack, newTiles) {
        let res = [];
        
        while (stack.length > 0) {
            // if there are more than 2 values, combine the top 2 if possible, otherwise just push
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
        res = res.concat(Array(4 - res.length).fill(0))

        // flip stack if direction is down or right
        if (direction === 'ArrowDown' || direction === 'ArrowRight')
            res = res.reverse();

        // fill row/column with combined values
        (direction === 'ArrowUp' || 
         direction === 'ArrowDown') ? fillTiles(i, 'vertical', res, newTiles) :
                                      fillTiles(i, 'horizontal', res, newTiles);
    }

    /*
        update the current row/column with new values 
    */
    function fillTiles(i, direction, res, newTiles) {
        for (let j = 0; j < 4; j++) {
            const dest = direction === 'vertical' ? indexMap[j][i] : indexMap[i][j];
            newTiles[dest] = res[j];
        }
    }

    /*
        renders a single tile
    */
    function renderTile(i) {
        // background and text color based on value
        const background = colorMap[tiles[i]] || '#CFC1B2';
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
