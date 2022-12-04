// Grid generation

// Get elements
const grid = document.querySelector('#grid');
const gridSizeSlider = document.querySelector('#gridSizeSlider');
const gridSizeValue = document.querySelector('#gridSizeValue');
const gridSizeButton = document.querySelector('#gridSizeButton');

const defaultGridSize = 16;
const gridPixelSize = 640;
let currentGridSize;

function createGrid(gridSize){

    // Remove all current pixels in the grid
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }

    // Generate new grid
    let gridSizeSquared = gridSize ** 2;
    let pixelSize = gridPixelSize / gridSize; 

    for (let i = 0; i < gridSizeSquared; i++) {
        const pixel = document.createElement('div');
        pixel.style.height = pixelSize + 'px';
        pixel.style.width = pixelSize + 'px';
        grid.append(pixel);
    }
}

// Create default grid first 
createGrid(defaultGridSize);
gridSizeValue.innerText = defaultGridSize + ' px';

// Select new grid size with slider
gridSizeSlider.oninput = function() {
    currentGridSize = parseInt(this.value);
    gridSizeValue.innerText = this.value + ' px';
}

// Apply new grid size with button
gridSizeButton.addEventListener('click', function() {
    createGrid(currentGridSize)
});













// Change color of pixel when hovered over
grid.addEventListener('mouseover', function(e){
    e.target.setAttribute('data-hover', 'true');
})
grid.addEventListener('mouseout', function(e){
    e.target.removeAttribute('data-hover');
})

// Change color of pixel when clicked
grid.addEventListener('mousedown', function(e){
    e.target.style.backgroundColor = 'blue';
})

