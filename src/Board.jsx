import React, {useState, useContext, useRef, useEffect} from 'react';
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
    const [tiles, setTiles] = useState(Array(16).fill().map(() => ({ val: 0, isNew: false })));
    const { isReset, handleReset, handleScoreChange } = useContext(GameContext);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);
    const [keepGoing, setKeepGoing] = useState(false);
    const validDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const pendingScoreRef = useRef(0);
    const availableRef = useRef(Array.from(Array(16).keys()));
    
    // for mobile swipes
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    const [touchEndY, setTouchEndY] = useState(null);
    
    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;

    useEffect(() => {
        if (!isInitialized) { initBoard(); }

        window.addEventListener('keydown', onKeyPress);

        // clean up
        return () => { window.removeEventListener('keydown', onKeyPress); }
    }, []);

    // reset board and variables if New Game button is pressed
    useEffect(() => {
        if (isReset) {
            pendingScoreRef.current = 0;
            availableRef.current = Array.from(Array(16).keys());
            handleReset(false);
            resetBoard();
        }
    }, [isReset]);

    useEffect(() => {
        handleScoreChange(pendingScoreRef.current);
    }, [pendingScoreRef.current])

    useEffect(() => {
        checkWinOrLose();
    }, [tiles]);
    
    /*
        reset board and regenerate first 2 tiles
    */
    function resetBoard() {
        setIsGameOver(false);
        setIsGameWon(false);
        setKeepGoing(false);
        setTiles(Array(16).fill().map(() => ({ val: 0, isNew: false })));
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

        if (isHorizontalSwipe) 
            direction = isLeft ? 'ArrowLeft' : 'ArrowRight';
        else 
            direction = isUp ? 'ArrowUp' : 'ArrowDown';

        handleTileMovement(direction);
    }

    function handleKeepGoing() {
        setKeepGoing(true);
        setIsGameWon(false);
    }

    /*
        places a new random tile (either 2 or 4) on the board
        - will only place 4 when there's already a 4 on the board
    */
    function generateTile() {
        setTiles((prevTiles) => {
            const newTiles = [...prevTiles];

            // generate new tile from available positions, then remove that tile from available positions
            const newPosition = availableRef.current[Math.floor(Math.random() * availableRef.current.length)];
            const indexToRemove = availableRef.current.indexOf(newPosition);
            availableRef.current.splice(indexToRemove, 1);

            // generate either 2 or 4 if board contains a 4, otherwise only generate 2
            const newVal = newTiles.some(tile => tile.val === 4) ? generateRandom() : 2;
            newTiles[newPosition] = {val: newVal, isNew: true};

            return newTiles;
        });
    }

    /*
        generate new tile value (2 or 4) with 90% probability of it being 2
    */
        function generateRandom() { 
            return Math.floor(Math.random() < 0.9 ? 2 : 4) 
        }

    /*
        generate array of available positions for new tile
    */
    function updateAvailable(newTiles) {
        availableRef.current = [];

        for (let i = 0; i < newTiles.length; i++) {
            if (newTiles[i].val == 0) 
                availableRef.current.push(i);
        }
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
                    if (newTiles[curr].val > 0) 
                        stack.push(newTiles[curr]);
                }

                stack = stack.reverse();

                // reverse the stack if going down/right
                if (reverseStack)
                    stack = stack.reverse();

                pendingScoreRef.current += combineTiles(i, direction, stack, newTiles);
            }

            updateAvailable(newTiles);

            // generate new tile only if tiles have changed
            if (!boardsEqual(prevTiles.map(tiles => tiles.val), newTiles.map(tiles => tiles.val)))
                generateTile();

            return newTiles;
        });
    }

    /*
        check if 2 boards are equal
    */
    function boardsEqual(b1, b2) {
        for (let i = 0; i < 16; i++) {
            if (b1[i] !== b2[i]) { return false; }
        }

        return true;
    }

    /*
        shifts the current row/column by joining values 
    */
    function combineTiles(i, direction, stack, newTiles) {
        let res = [];
        let rowColScore = 0;

        while (stack.length > 0) {
            // if there are more than 2 values, combine the top 2 if possible, otherwise just push
            if (stack.length > 1 && (stack[stack.length - 1].val === stack[stack.length - 2].val)) {
                const combinedVals = stack.pop().val * 2;
                rowColScore += combinedVals;
                stack.pop();
                res.push({ val: combinedVals, isNew: false });
            }
            else {
                res.push({ val: stack.pop().val, isNew: false });
            }
        }

        // fill remaining spaces with 0s
        res = res.concat(Array(4 - res.length).fill({ val: 0, isNew: false }))

        // flip stack if direction is down or right
        if (direction === 'ArrowDown' || direction === 'ArrowRight')
            res = res.reverse();

        // fill row/column with combined values
        (direction === 'ArrowUp' || 
         direction === 'ArrowDown') ? fillTiles(i, 'vertical', res, newTiles) :
                                      fillTiles(i, 'horizontal', res, newTiles);

        return rowColScore;
    }

    function checkValidMoves() {
        // if there are spaces available to generate new tile
        if (availableRef.current.length > 0) 
            return true;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const currIndex = indexMap[i][j];

                // if current tile is available
                if (tiles[currIndex].val === 0) 
                    return true;

                // if a move can be made based on current position
                if ((i < 3 && tiles[currIndex].val === tiles[indexMap[i + 1][j]].val) ||
                    (j < 3 && tiles[currIndex].val === tiles[indexMap[i][j + 1]].val)) {
                    return true;
                }
            }
        }

        return false;
    }

    function checkWinOrLose() {
        if (keepGoing)
            return;

        if (!isGameWon && tiles.some(tile => tile.val === 2048)) 
            setIsGameWon(true);
        
        if (!checkValidMoves()) 
            setIsGameOver(true);
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
        return tiles.map((tile, i) => <Tile key={`${tile.val}-${tile.isNew}-${i}-${Date.now()}`} val={tile.val} isNew={tile.isNew}/>);
    }

    function renderResult() {
        if (isGameOver) { return <span>Game Over!</span> }
        if (isGameWon) { return <span>You win!</span> }
    }
    
    return (
        <>
            <div className='container'>
                <div className='finished' style={{display: (isGameOver || isGameWon) ? 'flex' : 'none'}}>
                    {renderResult()}
                    <div className='finished-buttons-row'>
                        <button style={{display: isGameWon ? 'flex' : 'none' }} onClick={() => {handleKeepGoing()}}>Keep going</button>
                        <button onClick={() => {handleReset(true)}}>Try again</button>
                    </div>
                </div>
                <div className='board' onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    {renderTiles()}
                </div>
            </div>
        </>
    )
}

export default Board
