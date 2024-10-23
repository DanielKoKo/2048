import React, { useState, useContext } from 'react'

const validDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const [direction, setDirection] = useState(null);

const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null);
const [touchStartX, setTouchStartX] = useState(null);
const [touchEndX, setTouchEndX] = useState(null);
const [touchStartY, setTouchStartY] = useState(null);
const [touchEndY, setTouchEndY] = useState(null);

// the required distance between touchStart and touchEnd to be detected as a swipe
const minSwipeDistance = 50;

export function onTouchStart(e) {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
}

export function onTouchMove(e) {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
}

export function onTouchEnd() {
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

function Touch() {

}

export default Touch
