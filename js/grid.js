const grid = {
    defaultGridSize: 20,
    gridSize: 0,

    gridDiv: document.querySelector('#grid'),

    init() {
        console.log('Début Initialisation grille') // debug
        if (this.gridSize == 0 || this.gridSize == '') {
            this.gridSize = this.defaultGridSize
        }
        this.drawGrid();
        console.log('Fin Initialisation grille') // debug
    },
    clearGrid() {
        document.querySelectorAll('div.column').forEach(e => e.remove());
    },
    randomNum() {
        const MIN = 0;
        const max = this.gridSize
        return Math.floor(Math.random() * (max - MIN)) + MIN;
    },
    //Invaders
    drawGrid() {
        grid.clearGrid();
        pixel.initPixelsArray()
        for (let indexCol = 0; indexCol < grid.gridSize; indexCol++) {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            grid.drawPixelsColumn(columnDiv, indexCol);
            grid.gridDiv.appendChild(columnDiv);
        }
    },
    drawPixelsColumn(columnDiv, indexCol){   
        for (let indexRow = 0; indexRow < grid.gridSize; indexRow++) {   
            const pixelDiv = pixel.drawPixel();
            columnDiv.appendChild(pixelDiv);            
            pixel.pixelsArray[indexCol][indexRow] = pixelDiv;
        }
    },
}
