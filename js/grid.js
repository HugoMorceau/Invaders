const grid = {
    defaultSize: 35,
    row: 0,
    col: 0,
    size: 0,
    gridDiv: document.querySelector('#grid'),

    init() {
        console.log('Début Initialisation grille') // debug
        if (grid.row == 0 || grid.row == '') {
            grid.row = grid.defaultSize
        }
        if (grid.row == 0 || grid.row == '') {
            grid.col = grid.defaultSize
         }
        grid.size = grid.row * grid.col
        
        grid.draw();
        console.log('Fin Initialisation grille') // debug
    },
    clear() {
        document.querySelectorAll('div.column').forEach(e => e.remove());
    },
    randomNum(max) {
        const MIN = 0;
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
            pixelDiv.dataset['row'] = indexRow 
            columnDiv.appendChild(pixelDiv);            
            pixel.pixelsArray[indexCol][indexRow] = pixelDiv;
        }
    },
}
