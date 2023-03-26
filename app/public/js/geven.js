const geven = {
    alive: true,
    arrowKeyPressed: false,
    stateChanged: true,
    direction: '',
    lastMoveTime: 0,
    reset() {
        document.removeEventListener('keydown', geven.handleKeyboard)
        app.resetEmojiWin();
        pixel.pixelDrawColor = pixel.defaultPixelDrawColor;
        document.removeEventListener('touchstart', geven.handleTouchStart, false);
        document.removeEventListener('touchmove', geven.handleTouchMove, false);
        document.querySelectorAll('.pixel--even').forEach(function(elt)
        {         
            for (let i = elt.classList.length - 1; i >= 0; i--) {
                const className = elt.classList[i];
                if (className.startsWith('pixel--even')) {
                    elt.classList.remove(className);
                }
            }                                                           
        })
    },
    init() {
        app.currentMode = 'even'
        app.initEmojiWin();
        geven.listenKeyboard()
        geven.generateNumber()
        geven.generateNumber()
        geven.play()
    },
    generateNumber() {
        let col
        let row
        do{
            col = grid.randomNum(grid.col)
            row = grid.randomNum(grid.row)
        } while(pixel.pixelsArray[col][row].textContent != '')

        // on détermine aléatoirement si il s'agit d'un 2 d'un 4
        // la probabilité d'avoir un 4 est de 5%
        if (Math.floor(Math.random() * (20 - 1)) + 1 === 4) {
            pixel.pixelsArray[col][row].textContent = 4;
        } else { 
            pixel.pixelsArray[col][row].textContent = 2; 
        }
        geven.setPixelColor(pixel.pixelsArray[col][row])
    },
    removePixelColor(pix){
        if(pix.textContent < 8){
            pix.classList.remove('pixel--even-light')
            pix.classList.add('pixel--even-dark')
        }else{
            pix.classList.remove('pixel--even-dark')
            pix.classList.add('pixel--even-light')
        }
        pix.classList.remove('pixel--even-' + pix.textContent)
    },
    setPixelColor(pix){
        if(pix.textContent < 8){
            pix.classList.remove('pixel--even-light')
            pix.classList.add('pixel--even-dark')
        }else{
            pix.classList.remove('pixel--even-dark')
            pix.classList.add('pixel--even-light')
        }
        pix.classList.add('pixel--even-' + pix.textContent)
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
        if (geven.alive) {
            if (geven.arrowKeyPressed) {

                geven.arrowKeyPressed = false

                geven.transposeGrid('convert')
                geven.mergeNumbers()
                geven.moveNumbers(geven.direction)
                geven.transposeGrid('restore')      
                
                if (geven.stateChanged) {
                    geven.stateChanged = false
                    geven.generateNumber()
                }
            }
        } else {
            alert('you lose')
        }
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
            pixel.pixelsArray = app.transpose(pixel.pixelsArray)
        }
        if (this.direction === 'down') {
            // inversion de la ligne du tableau pour pouvoir la lire toujours dans le même ordre quelque soit la directio demandée
            if(mode === 'convert'){
                pixel.pixelsArray = app.transpose(pixel.pixelsArray).reverse()
            }else {
                pixel.pixelsArray = app.transpose(pixel.pixelsArray.reverse())
            }
        }
    },
    mergeNumbers(){
    // Fusionne les nombres
        for (let row= 0; row < grid.row; row++) {
            for (let col = 0; col < grid.col; col++){  
                // pour chaque col de row
                let pix = pixel.pixelsArray[col][row].textContent
                pixel.pixelsArray[col][row].setAttribute('merged', 'false')
                if (pix != ''){                    
                    let nextCol = col +1 
                    let nextPix = ''   
                    while(nextPix === '' && nextCol < grid.col){
                        nextPix = pixel.pixelsArray[nextCol][row].textContent
                        if(nextPix === pix){
                            geven.removePixelColor(pixel.pixelsArray[col][row])
                            pixel.pixelsArray[col][row].textContent = 2 * parseInt(pix, 10)
                            pixel.pixelsArray[col][row].setAttribute('merged', 'true')
                            geven.setPixelColor(pixel.pixelsArray[col][row])
                            geven.removePixelColor(pixel.pixelsArray[nextCol][row])
                            pixel.pixelsArray[nextCol][row].textContent = ''
                            pixel.pixelsArray[nextCol][row].setAttribute('merged', 'false')
                            geven.stateChanged = true
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
        for (let row= 0; row < grid.row; row++) {
            for (let col = 0; col < grid.col; col++){ 
                
                pixelMouved = false
                pixelMerged = false
                
                let pix = pixel.pixelsArray[col][row].textContent
                // Pour chaque pixel libre
                if(pix === '') {
                    let nextCol = col +1 
                    let nextPix = ''   
                    // Regarde les pixels suivants
                    
                    while(nextPix === '' && nextCol < grid.col){
                        nextPix = pixel.pixelsArray[nextCol][row].textContent
                        if(nextPix != ''){
                            // Déplace le pixel suivant ou sur-suivant sur le pixel libre
                            geven.removePixelColor(pixel.pixelsArray[col][row])
                            pixel.pixelsArray[col][row].textContent = parseInt(nextPix, 10)
                            if(pixel.pixelsArray[nextCol][row].getAttribute('merged')=== 'true'){
                                pixelMouved = true
                                pixelMerged = true
                            }
                            geven.setPixelColor(pixel.pixelsArray[col][row])
                            geven.removePixelColor(pixel.pixelsArray[nextCol][row])
                            pixel.pixelsArray[nextCol][row].textContent = ''
                            pixel.pixelsArray[nextCol][row].setAttribute('merged', 'false')
                            geven.stateChanged = true
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
                    geven.zoomZoomZangDansTaBenzBenzBenz(pixel.pixelsArray[col][row])
                }
            }
        }
    },
    // EVENTS LISTENERS / HANDLERS
    listenKeyboard() {
        document.addEventListener('keydown', geven.handleKeyboard)
        // swipe
        document.addEventListener('touchstart', geven.handleTouchStart, false);
        document.addEventListener('touchmove', geven.handleTouchMove, false);
        
    },
    handleTouchStart(event) {
        // Enregistre la position de départ du swipe
        geven.touchStartX = event.touches[0].clientX;
        geven.touchStartY = event.touches[0].clientY;
        
    },
    handleTouchMove(event) {
        if (event.touches.length > 1) {
            // Ignore les gestes multi-touch
            return;
        }

        // Limitations
        const now = Date.now();
        if (now - geven.lastMoveTime < 200) {
            // Limite la fréquence des mouvements à 5 par seconde
            return;
        }
        geven.lastMoveTime = now;

        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;
    
        const deltaX = touchEndX - geven.touchStartX;
        const deltaY = touchEndY - geven.touchStartY;
        geven.arrowKeyPressed = true
        // Détermine la direction du swipe en fonction du mouvement le plus important
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            
            if (deltaX > 0) {
                // Swipe à droite
                geven.direction = 'right';
                geven.play()
            } else {
                // Swipe à gauche
                geven.direction = 'left';
                geven.play()
            }
        } else {
            if (deltaY > 0) {
                // Swipe vers le bas
                geven.direction = 'down';
                geven.play()
            }else {
                // swipe up
                geven.direction = 'up';
                geven.play()
              }
        }
    },
    handleKeyboard(event) {
        if (event.code.substring(0, 5) === 'Arrow') {
            event.preventDefault()
            geven.direction = event.code.split('Arrow')[1].toLowerCase()
            //geven.direction = geven.direction.toLowerCase()
            geven.arrowKeyPressed = true
            geven.play()
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