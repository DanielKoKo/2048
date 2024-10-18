import React, {useState, useEffect} from 'react';
import './Board.css';

function Board() {
    const [tiles, setTiles] = useState(Array(16).fill(0));
    const [init, setInit] = useState(false);

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
        if (!init) {
            placeRandomTile();
            placeRandomTile();
            
            // testing purposes
            //const newTiles = [...tiles];
            //newTiles[0] = 4;
            //newTiles[1] = 2;
            // newTiles[2] = 8;
            // newTiles[3] = 16;
            // newTiles[4] = 2;
            //setTiles(newTiles);

            setInit(true);
        }

        window.addEventListener('keydown', moveTiles);

        return () => {
            window.removeEventListener('keydown', moveTiles);
        }
    }, []);

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
        const input = e.key;
        //console.log(direction);
        if (input === 'ArrowUp')
            moveCol('ArrowUp');
        else if (input === 'ArrowDown')
            moveCol('ArrowDown');
        else if (input === 'ArrowLeft')
            moveRow('ArrowLeft');
        else if (input === 'ArrowRight')
            moveRow('ArrowRight');
        else
            return;

        placeRandomTile();
    }

    function moveCol(direction) {
        setTiles((prevTiles) => {
            const newTiles = [...prevTiles];

            for (let c = 0; c < 4; c++) {
                let stack = [];

                for (let r = 3; r >= 0; r--) {
                    const curr = indexMap[r][c];

                    // only add tiles with values to stack
                    if (newTiles[curr] > 0)
                        stack.push(newTiles[curr]);
                }

                // reverse the stack if going down
                if (direction === 'ArrowDown')
                    stack = stack.reverse();

                combine(c, direction, stack, newTiles);
                //console.log(newTiles);
            }

            /*
            for (let r = 1; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const curr = indexMap[r][c];
                    const dest = indexMap[r - 1][c];

                    if (newTiles[curr] === '')
                        continue;

                    if (newTiles[dest] === '') {
                        newTiles[dest] = newTiles[curr];
                    }
                    else if (newTiles[dest] === newTiles[curr]) {
                        newTiles[dest] = (parseInt(newTiles[dest]) + parseInt(newTiles[curr])).toString();
                    }
                    else {
                        continue;
                    }

                    newTiles[curr] = '';
                }
            } 
            */

            return newTiles;
        })

        //console.log("prevtiles: " + p);
        //console.log("tiles: " + tiles);
    }

    function moveRow(direction) {
        setTiles((prevTiles) => {
            const newTiles = [...prevTiles];

            // traverse by column
            for (let r = 0; r < 4; r++) {
                let stack = [];

                for (let c = 0; c < 4; c++) {
                    const curr = indexMap[r][c];

                    // only add tiles with values to stack
                    if (newTiles[curr] > 0)
                        stack.push(newTiles[curr]);
                }

                // reverse the stack if going left
                if (direction === 'ArrowLeft')
                    stack = stack.reverse();

                combine(r, direction, stack, newTiles);
                //console.log(newTiles);
            }

            return newTiles;
        })
    }

    function combine(rowCol, direction, stack, newTiles) {
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

        // fill remaining spaces with ''
        const rem_len = 4 - res.length;
        res = res.concat(Array(rem_len).fill(0))

        // flip column if direction is down
        if (direction === 'ArrowDown' || direction === 'ArrowRight')
            res = res.reverse();

        //console.log('res: ' + res);

        // fill row/column with combined values
        if (direction === 'ArrowUp' || direction === 'ArrowDown')
            fillCol(rowCol, res, newTiles);
        else
            fillRow(rowCol, res, newTiles);
    }

    function fillCol(col, res, newTiles) {
        for (let r = 0; r < 4; r++) {
            const dest = indexMap[r][col];
            newTiles[dest] = res[r];
        }
    }

    function fillRow(row, res, newTiles) {
        for (let c = 0; c < 4; c++) {
            const dest = indexMap[row][c];
            newTiles[dest] = res[c];
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
