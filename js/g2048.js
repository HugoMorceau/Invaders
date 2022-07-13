const g2048 = {
    alive: true,
    arrowKeyPressed: false,
    stateChanged: true,
    direction: '',
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
        g2048.setPixelColor(pixel.pixelsArray[col][row])
    },
    removePixelColor(pix){
        if(pix.textContent < 8){
            pix.classList.remove('pixel--2048-light')
            pix.classList.add('pixel--2048-dark')
        }else{
            pix.classList.remove('pixel--2048-dark')
            pix.classList.add('pixel--2048-light')
        }
        pix.classList.remove('pixel--2048-' + pix.textContent)
    },
    setPixelColor(pix){
        if(pix.textContent < 8){
            pix.classList.remove('pixel--2048-light')
            pix.classList.add('pixel--2048-dark')
        }else{
            pix.classList.remove('pixel--2048-dark')
            pix.classList.add('pixel--2048-light')
        }
        pix.classList.add('pixel--2048-' + pix.textContent)
    },
    zoomZoomZangDansTaBenzBenzBenz(pix){
        pix.classList.toggle('pixel--transition')
        //pix.classList.toggle('pixel--transition-out')
        setTimeout(()=>{
            pix.classList.toggle('pixel--transition')
           // pix.classList.toggle('pixel--transition-out')
        }, 75)
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
                pixel.pixelsArray[col][row].setAttribute('merged', 'false')
                if (pix != ''){                    
                    let nextCol = col +1 
                    let nextPix = ''   
                    while(nextPix === '' && nextCol < grid.gridSize){
                        nextPix = pixel.pixelsArray[nextCol][row].textContent
                        if(nextPix === pix){
                            g2048.removePixelColor(pixel.pixelsArray[col][row])
                            pixel.pixelsArray[col][row].textContent = 2 * parseInt(pix, 10)
                            pixel.pixelsArray[col][row].setAttribute('merged', 'true')
                            g2048.setPixelColor(pixel.pixelsArray[col][row])
                            g2048.removePixelColor(pixel.pixelsArray[nextCol][row])
                            pixel.pixelsArray[nextCol][row].textContent = ''
                            pixel.pixelsArray[nextCol][row].setAttribute('merged', 'false')
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
                
                pixelMouved = false
                pixelMerged = false
                
                let pix = pixel.pixelsArray[col][row].textContent
                // Pour chaque pixel libre
                if(pix === '') {
                    let nextCol = col +1 
                    let nextPix = ''   
                    // Regarde les pixels suivants
                    
                    while(nextPix === '' && nextCol < grid.gridSize){
                        nextPix = pixel.pixelsArray[nextCol][row].textContent
                        if(nextPix != ''){
                            // Déplace le pixel suivant ou sur-suivant sur le pixel libre
                            g2048.removePixelColor(pixel.pixelsArray[col][row])
                            pixel.pixelsArray[col][row].textContent = parseInt(nextPix, 10)
                            if(pixel.pixelsArray[nextCol][row].getAttribute('merged')=== 'true'){
                                pixelMouved = true
                                pixelMerged = true
                            }
                            g2048.setPixelColor(pixel.pixelsArray[col][row])
                            g2048.removePixelColor(pixel.pixelsArray[nextCol][row])
                            pixel.pixelsArray[nextCol][row].textContent = ''
                            pixel.pixelsArray[nextCol][row].setAttribute('merged', 'false')
                            g2048.stateChanged = true
                            break
                        }
                        nextCol++
                    }
                }
                // Si le pixel a été mergé, il faut l'animer, 
                // à sa nouvelle position si elle a changée
                if(!pixelMouved){
                    if(pixel.pixelsArray[col][row].getAttribute('merged') === 'true'){
                        pixelMerged = true
                    }
                }
                if (pixelMerged){
                    g2048.zoomZoomZangDansTaBenzBenzBenz(pixel.pixelsArray[col][row])
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