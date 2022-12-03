// Get elements
const grid = document.querySelector('#grid');

// Generate the pixels in the grid
for (let i = 0; i < 16; i++) {
    const pixel = document.createElement('div');
    pixel.setAttribute('class', 'pixel');
    grid.append(pixel);
}
