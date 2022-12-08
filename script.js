// #region Get elements
const grid = document.querySelector('#grid');
// Grid size
const gridSizeValue = document.querySelector('#gridSizeValue');
const gridSizeSlider = document.querySelector('#gridSizeSlider');
const gridSizeButton = document.querySelector('#gridSizeButton');
// Brush color
const colorPicker = document.querySelector('#colorPicker');
const currentColor = document.querySelector('#currentColor');
const recentColors = document.querySelector('#recentColors');
const defaultColors = document.querySelector('#defaultColors');
// Tools
const gridLinesButton = document.querySelector('#gridLines');
const clearButton = document.querySelector('#clear');
const pipetteButton = document.querySelector('#pipette');
// #endregion



// #region Initialize global variables
let brushColor;
// #endregion



// #region Tools

// Toggle grid lines
let gridLines = false;
gridLinesButton.addEventListener('click', function() {
    if (gridLines) {
        for (let i = 0; i < grid.childElementCount; i++) {
            grid.childNodes[i].removeAttribute('data-outlined');
         }
         gridLines = false;
    } else {
        for (let i = 0; i < grid.childElementCount; i++) {
            grid.childNodes[i].setAttribute('data-outlined', 'true');
         }
         gridLines = true;
    }
});

// Clear 
clearButton.addEventListener('click', function () {
    for (let i = 0; i < grid.childElementCount; i++) {
        grid.childNodes[i].style.backgroundColor = 'transparent';
     }
});

// Pipette
pipetteButton.addEventListener('click', function(e) {
    brushColor = e.target.style.backgroundColor;
});

function pipette(eventObject) {

}

// #endregion



// #region Grid generation

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
        // Keep grid lines on 
        if (gridLines == true) {
            pixel.setAttribute('data-outlined', 'true');
        }
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
});
// Click button to generate the new pixels
gridSizeButton.addEventListener('click', function() {
    createPixels(rootPixelCount)
});

// #endregion



// #region Drawing and erasing mechanics
const leftMouseButtonID = 0;
const rightMouseButtonID = 2;
let mouseButtonFired;
let isMouseClicked;

// Change between drawing and erasing modes
function changeBrushMode(eventObject, brushMode) {
    if (brushMode === 'draw') {
        eventObject.target.style.backgroundColor = brushColor;
    } else if (brushMode === 'erase') {
        eventObject.target.style.backgroundColor = 'transparent';
    }
}
// Modify pixel on mousedown
function modifyPixelOnClick(eventObject) {
    isMouseClicked = true;
    // Draw or erase and record which mouse button initiated it
    if (eventObject.button === leftMouseButtonID) {
        changeBrushMode(eventObject, 'draw');
        mouseButtonFired = leftMouseButtonID;
    } else if (eventObject.button === rightMouseButtonID) {
        changeBrushMode(eventObject, 'erase');
        mouseButtonFired = rightMouseButtonID;
    }
}
// Modify pixel on mouseover
function modifyPixelOnHover(eventObject) {
    if(isMouseClicked){
        if (mouseButtonFired === leftMouseButtonID) {
            changeBrushMode(eventObject, 'draw');
        } else if (mouseButtonFired === rightMouseButtonID) {
            changeBrushMode(eventObject, 'erase');
        }
    }
}
// Record mouseup
function stopMouseClick() {
    isMouseClicked = false;
}
// Highlight pixel on mouseover 
function highlightPixel(eventObject) {
    eventObject.target.setAttribute('data-hovered', 'true');
}
// Un-highlight on pixel on mouseout
function unHighlightPixel(eventObject) {
    eventObject.target.removeAttribute('data-hovered');
}

grid.addEventListener('mouseover', highlightPixel);
grid.addEventListener('mouseout', unHighlightPixel);

function enableDrawing(boolean = true) {
    if (boolean) {
        grid.addEventListener('mousedown', modifyPixelOnClick);
        document.addEventListener('mouseup', stopMouseClick);
        grid.addEventListener('mouseover', modifyPixelOnHover);
    } else if (boolean === false) {
        grid.removeEventListener('mousedown', modifyPixelOnClick);
        document.removeEventListener('mouseup', stopMouseClick);
        grid.removeEventListener('mouseover', modifyPixelOnHover);
    }
}

// Disallow user from dragging elements which fixes brush from drawing when mouse is not clicked
document.addEventListener("dragstart", function(e) {
    e.preventDefault();
});
// Prevent context menu from firing when user erases with right-click
grid.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Enable drawing when site first loads
enableDrawing();

//#endregion



// #region Brush color

// Update the display of the current brush color
function updateCurrentColor() {
    currentColor.style.backgroundColor = brushColor;
}

// Create button for brush color
function createColorButton(colorName, parentNode) {
    buttonName = colorName + 'Button';
    buttonName = document.createElement('button');
    buttonName.innerText = colorName;
    buttonName.addEventListener('click', function() {
        brushColor = colorName;
        addToRecentColors(colorName);
        updateCurrentColor();
    })
    parentNode.append(buttonName);
}

// Create section of recent colors
let recentColorArray = [];
function addToRecentColors(colorName) {

    // Check if color is already available 
    if (recentColorArray.includes(colorName)) {
        // Remove old instance of the brush color first
        recentColorArray.splice(recentColorArray.indexOf(colorName), 1);
        recentColorArray.unshift(colorName);
    // Check if recent color section if full
    } else if (recentColorArray.length >= 10) {
        recentColorArray.pop();
        recentColorArray.unshift(colorName);
    } else {
        recentColorArray.unshift(colorName);
    }
 
    // Remove all current recent color buttons
    while (recentColors.firstChild) recentColors.removeChild(recentColors.lastChild);

    // Generate new color buttons
    for (let i = 0; i < recentColorArray.length; i++) {
        createColorButton(recentColorArray[i], recentColors);
    }

}

// Create section of default colors
const defaultColorArray = ['black', 'gray', 'blue', 'green', 'yellow', 'orange', 'red', 'pink']
for (let i = 0; i < defaultColorArray.length; i++) {
    createColorButton(defaultColorArray[i], defaultColors);
}

// Change brush color with color picker
colorPicker.addEventListener('change', function() {
    brushColor = colorPicker.value;
    addToRecentColors (brushColor);
    updateCurrentColor();
});

// Set the default brush color when site first loads
const defaultBrushColor = 'black';
brushColor = defaultBrushColor;
updateCurrentColor();

//#endregion




