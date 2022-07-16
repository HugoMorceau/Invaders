const grid = {
    defaultSize: 35,
    row: 10,
    col: 3,
    size: 0,
    gridDiv: document.querySelector('#grid'),

    init() {
        console.log('Début Initialisation grille') // debug
        grid.size = grid.row * grid.col
        if (grid.size == 0 || grid.size == '') {
            grid.row = grid.defaultSize
            grid.col = grid.defaultSize
            grid.size = grid.row * grid.col
        }
        grid.draw();
        console.log('Fin Initialisation grille') // debug
    },
    clear() {
        document.querySelectorAll('div.column').forEach(e => e.remove());
    },
    randomNum() {
        const MIN = 0;
        const max = grid.size
        return Math.floor(Math.random() * (max - MIN)) + MIN;
    },
    //Invaders
    draw() {
        grid.clear();
        pixel.initPixelsArray()
        for (let indexCol = 0; indexCol < grid.col; indexCol++) {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            grid.drawPixelsColumn(columnDiv, indexCol);
            grid.gridDiv.appendChild(columnDiv);
        }
    },
    drawPixelsColumn(columnDiv, indexCol){   
        for (let indexRow = 0; indexRow < grid.row; indexRow++) {   
            const pixelDiv = pixel.drawPixel();
            columnDiv.appendChild(pixelDiv);            
            pixel.pixelsArray[indexCol][indexRow] = pixelDiv;
        }
    },
}
