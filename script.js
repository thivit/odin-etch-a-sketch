// #region Grid generation

// Get elements
const grid = document.querySelector('#grid');
const gridSizeValue = document.querySelector('#gridSizeValue');
const gridSizeSlider = document.querySelector('#gridSizeSlider');
const gridSizeButton = document.querySelector('#gridSizeButton');

// Generate pixels in the grid 
function createPixels(rootPixelCount){
    // Remove all current pixels in the grid
    while (grid.firstChild) grid.removeChild(grid.lastChild);
    // Value of gridHeight from css file under #grid id
    const gridHeight = 640;
    let pixelCount = rootPixelCount ** 2;
    let pixelSize = gridHeight / rootPixelCount; 
    // Generate pixels 
    for (let i = 0; i < pixelCount; i++) {
        const pixel = document.createElement('div');
        pixel.style.height = pixelSize + 'px';
        pixel.style.width = pixelSize + 'px';
        grid.append(pixel);
    }
}

// Update value shown for grid size
function updateGridValue(gridValue) {
    gridSizeValue.innerText = `Grid Size: ${gridValue} x ${gridValue}`;
}

// Create the default number of pixels when site first loads
const defaultRootPixelCount = 16;
createPixels(defaultRootPixelCount);
updateGridValue(defaultRootPixelCount);

// Change grid size with a new pixel count
let rootPixelCount;
// Drag slider to select new pixel count
gridSizeSlider.addEventListener('input', function() {
    rootPixelCount = parseInt(this.value);
    updateGridValue(this.value);
})
// Click button to generate the new pixels
gridSizeButton.addEventListener('click', function() {
    createPixels(rootPixelCount)
});

// #endregion



// #region Drawing mechanics

// Disallow user from dragging elements which fixes brush from drawing when mouse is not clicked
document.addEventListener("dragstart", function(e) {
    e.preventDefault();
  })

// Color first pixel user clicked on
grid.addEventListener('mousedown', function(e){
    e.target.style.backgroundColor = brushColor;
})

// Color pixels hovered over if mouse click is held down
let isMouseClicked = false;

document.addEventListener('mousedown', function() {
    isMouseClicked = true;
})

document.addEventListener('mouseup', function() {
    isMouseClicked = false;
})

grid.addEventListener('mouseover', function(e) {
    if(isMouseClicked){
        e.target.style.backgroundColor = brushColor;
    }
})

// Highlight pixels temporarily when hovered over 
grid.addEventListener('mouseover', function(e){
    e.target.setAttribute('data-hovered', 'true');
})
grid.addEventListener('mouseout', function(e){
    e.target.removeAttribute('data-hovered');
})

//#endregion



// #region Brush color

// Get elements
const colorPicker = document.querySelector('#colorPicker');
const currentColor = document.querySelector('#currentColor')
const defaultColors = document.querySelector('#defaultColors'); 

// Set default brush color
let brushColor = 'black';
updateCurrentColor()

// Show current brush color
function updateCurrentColor() {
    currentColor.style.backgroundColor = brushColor;
}

// Change brush color when new color is picked
colorPicker.addEventListener('change', function() {
    brushColor = colorPicker.value;
    updateCurrentColor()
})

// Default color section
const defaultColorArray = ['black', 'gray', 'blue', 'green', 'yellow', 'orange', 'red', 'pink']

function createDefaultColorButton(colorName) {
    buttonName = colorName + 'Button';
    buttonName = document.createElement('button');
    buttonName.innerText = colorName;
    buttonName.addEventListener('click', function() {
        brushColor = colorName;
        updateCurrentColor()
    })
    defaultColors.append(buttonName);
}

defaultColorArray.forEach(createDefaultColorButton);

//#endregion

