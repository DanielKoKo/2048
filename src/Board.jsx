import React, {useState, useContext, useEffect} from 'react';
import { GameContext } from './App';
import Tile from './Tile';
import './Board.css';

// map of index positions for the tiles on the board
const indexMap = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15]
];

function Board() {
    const [tiles, setTiles] = useState(Array(16).fill(0));
    const { isReset, handleReset } = useContext(GameContext);
    const [isInitialized, setIsInitialized] = useState(false);
    const validDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const [touchStartX, setTouchStartX] = useState(null)
    const [touchEndX, setTouchEndX] = useState(null)
    const [touchStartY, setTouchStartY] = useState(null)
    const [touchEndY, setTouchEndY] = useState(null)
    
    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;

    useEffect(() => {
        if (!isInitialized) { initBoard(); }

        window.addEventListener('keydown', onKeyPress);

        // clean up
        return () => { window.removeEventListener('keydown', onKeyPress); }
    }, []);

    // reset the board if isReset == true
    useEffect(() => {
        if (isReset) {
            resetBoard();
            handleReset(false); // reset the isReset variable
        }
    }, [isReset]);

    /*
        reset board and regenerate first 2 tiles
    */
    function resetBoard() {
        setTiles(Array(16).fill(0));
        initBoard();
    }

    /*
        initializes board with 2 random tiles with value 2
    */
    function initBoard() {
        generateTile();
        generateTile();

        setIsInitialized(true);
    }

    function onKeyPress(e) {
        const direction = e.key;

        // return if input isn't an arrow key
        if (!validDirections.includes(direction)) { return; }

        handleTileMovement(direction);
    }

    function onTouchStart(e) {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX);
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchStartY(e.targetTouches[0].clientY);
    }

    function onTouchMove(e) {
        setTouchEnd(e.targetTouches[0].clientX);
        setTouchEndX(e.targetTouches[0].clientX);
        setTouchEndY(e.targetTouches[0].clientY);
    }

    function onTouchEnd() {
        if (!touchStart || !touchEnd) return

        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;
        const isLeft = deltaX > minSwipeDistance;
        const isUp = deltaY > minSwipeDistance;
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        let direction;

        if (isHorizontalSwipe) {
            direction = isLeft ? 'ArrowLeft' : 'ArrowRight';
        }
        else {
            direction = isUp ? 'ArrowUp' : 'ArrowDown';
        }

        handleTileMovement(direction);
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
    function handleTileMovement(direction) {
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

            // check if tiles have changed (if not, dont' generate new random tile)
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
        renders all tiles
    */
    function renderTiles() {
        return tiles.map((val, i) => <Tile key={i} val={val}/>);
    }

    return (
        <>
            <div className='game-over' display='none'>
                <div className='board' onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    {renderTiles()}
                </div>
            </div>
        </>
    )
}

export default Board
