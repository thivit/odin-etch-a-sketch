// Get elements
const grid = document.querySelector('#grid');

// Generate the pixels in the grid
for (let i = 0; i < 16; i++) {
    const pixel = document.createElement('div');
    pixel.setAttribute('class', 'pixel');
    grid.append(pixel);
}

// Change color of pixel when clicked
grid.addEventListener('click', function(e){
    e.target.style.backgroundColor = 'blue';
})