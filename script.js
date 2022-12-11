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
const eraserButton = document.querySelector('#eraser');
// #endregion



// #region Defaults
const defaultRootPixelCount = 16;
const defaultBrushColor = 'black';
const defaultColorArray = [
    'white',
    'gray',
    'black',  
    'purple', 
    'pink', 
    'red', 
    'orange', 
    'yellow', 
    'green',
    'teal',
    'blue',
    'navy'
]
// #endregion



// #region Tools
// Toggle grid lines
let gridLines = false;
gridLinesButton.addEventListener('click', function() {
    if (gridLines) {
        gridLinesButton.setAttribute('class', 'toolButton');
        for (let i = 0; i < grid.childElementCount; i++) {
            grid.childNodes[i].removeAttribute('data-outlined');
         }
         gridLines = false;
    } else {
        gridLinesButton.setAttribute('class', 'toolButtonSelected');
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
pipetteButton.addEventListener('click', function() {
    function pipetteEnvironment(boolean) {
        if (boolean) {
            pipetteButton.setAttribute('class', 'toolButtonSelected');
            enableDrawing(false);
            // Delay adding event listener to prevent pipette button from triggering immediately
            setTimeout(function() {
                document.addEventListener('click', checkElementClicked);
            }, 10);
        } else {
            pipetteButton.setAttribute('class', 'toolButton');
            enableDrawing();
            document.removeEventListener('click', checkElementClicked);
        }
    }
    function checkElementClicked(e) {
        let isPixel = e.target.classList.contains('pixel');
        let elementColor = e.target.style.backgroundColor;
        if (isPixel) {updateBrushColor(elementColor);}
        pipetteEnvironment(false);
    }
    pipetteEnvironment(true);
});
// Eraser
let eraser = false;
eraserButton.addEventListener('click', function() {
    if (!eraser) {
        brushColor = 'transparent';
        eraserButton.setAttribute('class', 'toolButtonSelected');
        eraser = true;
    } else {
        brushColor = currentColor.style.backgroundColor;
        eraserButton.setAttribute('class', 'toolButton');
        eraser = false;
    }
})
// #endregion



// #region Grid generation
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
        pixel.setAttribute('class', 'pixel');
        // Keep grid lines on 
        if (gridLines == true) {
            pixel.setAttribute('data-outlined', 'true');
        }
        grid.append(pixel);
    }
}
function updateGridValue(gridValue) {
    gridSizeValue.innerText = `Grid Size: ${gridValue} x ${gridValue}`;
}

let rootPixelCount;
// New grid size
gridSizeSlider.addEventListener('input', function() {
    rootPixelCount = parseInt(this.value);
    updateGridValue(this.value);
});
// Confirm grid size change
gridSizeButton.addEventListener('click', function() {
    createPixels(rootPixelCount)
});
// #endregion



// #region Drawing and erasing mechanics
const leftMouseButtonID = 0;
const rightMouseButtonID = 2;
let mouseButtonFired;
let isMouseClicked;

// Drawing || Erasing mode changing
function changeBrushMode(eventObject, brushMode) {
    if (brushMode === 'draw') {
        eventObject.target.style.backgroundColor = brushColor;
    } else if (brushMode === 'erase') {
        eventObject.target.style.backgroundColor = 'transparent';
    }
}
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
function modifyPixelOnHover(eventObject) {
    if(isMouseClicked){
        if (mouseButtonFired === leftMouseButtonID) {
            changeBrushMode(eventObject, 'draw');
        } else if (mouseButtonFired === rightMouseButtonID) {
            changeBrushMode(eventObject, 'erase');
        }
    }
}
function stopMouseClick() {
    isMouseClicked = false;
}
function highlightPixel(eventObject) {
    eventObject.target.setAttribute('data-hovered', 'true');
}
function unHighlightPixel(eventObject) {
    eventObject.target.removeAttribute('data-hovered');
}
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

grid.addEventListener('mouseover', highlightPixel);
grid.addEventListener('mouseout', unHighlightPixel);

// Disallow user from dragging elements which fixes brush from drawing when mouse is not clicked
document.addEventListener("dragstart", function(e) {
    e.preventDefault();
});
// Prevent context menu from firing when user erases with right-click
grid.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
//#endregion



// #region Brush color
let brushColor;
// Change the brush color, add to recent colors, change the current color display
function updateBrushColor(color) {
    brushColor = color;
    addToRecentColors(color);
    currentColor.style.backgroundColor = color;
}
function createColorButton(colorName, parentNode) {
    buttonName = colorName + 'Button';
    buttonName = document.createElement('button');
    buttonName.setAttribute('class', 'colorButton');
    buttonName.style.backgroundColor = colorName;
    buttonName.addEventListener('click', function() {
        updateBrushColor(colorName);
    })
    parentNode.append(buttonName);
}
// Recent colors
let recentColorArray = [];
function addToRecentColors(colorName) {
    const recentColorAmount = 12;
    // Check if color is already available 
    if (recentColorArray.includes(colorName)) {
        // Remove old instance of the brush color first
        recentColorArray.splice(recentColorArray.indexOf(colorName), 1);
        recentColorArray.unshift(colorName);
    // Check if recent color section if full
    } else if (recentColorArray.length >= recentColorAmount) {
        recentColorArray.pop();
        recentColorArray.unshift(colorName);
    } else {
        recentColorArray.unshift(colorName);
    }
    // Remove all current recent color buttons
    while (recentColors.firstChild) recentColors.removeChild(recentColors.lastChild)
    // Generate new color buttons
    for (let i = 0; i < recentColorArray.length; i++) {
        createColorButton(recentColorArray[i], recentColors);
    }
}
// Default colors
for (let i = 0; i < defaultColorArray.length; i++) {
    createColorButton(defaultColorArray[i], defaultColors);
}
// Color picker
colorPicker.addEventListener('change', function() {
    updateBrushColor(colorPicker.value);
});
//#endregion



// #region Load first
createPixels(defaultRootPixelCount);
updateGridValue(defaultRootPixelCount);
updateBrushColor(defaultBrushColor);
enableDrawing();
// #endregion


