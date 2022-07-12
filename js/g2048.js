const g2048 = {
    alive: true,
    arrowKeyPressed: false,
    stateChanged: true,
    direction: '',
    alreadyMerged: false,
    reset() {
        document.removeEventListener('keydown', g2048.handleKeyboard)
    },
    init() {

        g2048.listenKeyboard()
        g2048.generateNumber()
        g2048.generateNumber()
        g2048.play()
    },
    generateNumber() {
        let col
        let row
        do{
            col = grid.randomNum()
            row = grid.randomNum()
        } while(pixel.pixelsArray[col][row].textContent != '')

        // on détermine aléatoirement si il s'agit d'un 2 d'un 4
        // la probabilité d'avoir un 4 est de 5%
        if (Math.floor(Math.random() * (20 - 1)) + 1 === 4) {
            pixel.pixelsArray[col][row].textContent = 4;
        } else { 
            pixel.pixelsArray[col][row].textContent = 2; 
        }
    },
    play() {
        if (g2048.alive) {
            if (g2048.arrowKeyPressed) {

                g2048.arrowKeyPressed = false

                g2048.transposeGrid('convert')
                g2048.mergeNumbers()
                g2048.moveNumbers(g2048.direction)
                g2048.transposeGrid('restore')      
                
                if (g2048.stateChanged) {
                    g2048.stateChanged = false
                    g2048.generateNumber()
                }
            }
        } else {
            alert('you lose')
        }
    },
    transpose(matrix) {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    },
    transposeGrid(mode){
      // Selon la direction demandée, on transpose la grille pour pouvoir
        // toujours faire une analyse de gauche à droite et de haut en bas
        if (this.direction === 'right') {
            // inversion de la ligne du tableau pour pouvoir la lire toujours dans le même ordre quelque soit la directio demandée
            pixel.pixelsArray.reverse();
        }
        if (this.direction === 'up') {
            // inversion de la ligne du tableau pour pouvoir la lire toujours dans le même ordre quelque soit la directio demandée
            pixel.pixelsArray = g2048.transpose(pixel.pixelsArray)
        }
        if (this.direction === 'down') {
            // inversion de la ligne du tableau pour pouvoir la lire toujours dans le même ordre quelque soit la directio demandée
            if(mode === 'convert'){
                pixel.pixelsArray = g2048.transpose(pixel.pixelsArray).reverse()
            }else {
                pixel.pixelsArray = g2048.transpose(pixel.pixelsArray.reverse())
            }
        }
    },
    mergeNumbers(){
    // Fusionne les nombres
        for (let row= 0; row < grid.gridSize; row++) {
            for (let col = 0; col < grid.gridSize; col++){  
                // pour chaque col de row
                let pix = pixel.pixelsArray[col][row].textContent
                if (pix != ''){                    
                    let nextCol = col +1 
                    let nextPix = ''   
                    while(nextPix === '' && nextCol < grid.gridSize){
                        nextPix = pixel.pixelsArray[nextCol][row].textContent
                        if(nextPix === pix){
                            pixel.pixelsArray[col][row].textContent = 2 * parseInt(pix, 10)
                            pixel.pixelsArray[nextCol][row].textContent = ''
                            g2048.stateChanged = true
                            col ++ // on peut skip l'analyse du prochain pixel puisqu'il vient d'être mis à ' ' 
                            break
                        }
                        nextCol++
                    } 
                }
            }
        }
    },
    moveNumbers(){
        for (let row= 0; row < grid.gridSize; row++) {
            for (let col = 0; col < grid.gridSize; col++){ 
                let pix = pixel.pixelsArray[col][row].textContent
                if(pix === '') {
                    let nextCol = col +1 
                    let nextPix = ''   
                    while(nextPix === '' && nextCol < grid.gridSize){
                        nextPix = pixel.pixelsArray[nextCol][row].textContent
                        if(nextPix != ''){
                            pixel.pixelsArray[col][row].textContent = parseInt(nextPix, 10)
                            pixel.pixelsArray[nextCol][row].textContent = ''
                            g2048.stateChanged = true
                            break
                        }
                        nextCol++
                    }
                }
            }
        }
    },
    // EVENTS LISTENERS / HANDLERS
    listenKeyboard() {
        document.addEventListener('keydown', g2048.handleKeyboard)
    },
    handleKeyboard(event) {
        if (event.code.substring(0, 5) === 'Arrow') {
            event.preventDefault()
            g2048.direction = event.code.split('Arrow')[1].toLowerCase()
            //g2048.direction = g2048.direction.toLowerCase()
            g2048.arrowKeyPressed = true
            g2048.play()
        }
        // Gestion des autres touches
        switch (event.code) {
            case 'Space':
                // Pause le jeu, a developper plus tard
                break;
            default:
                break;
        }
    },
}