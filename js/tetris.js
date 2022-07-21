
const tetris = {
    intervalId:0,
    iamAlive: true,
    resetRequired: false,
    defaultDelay: 400,
    sprintDelay: 35,
    delay: 0,
    previousTetro: '',
    activeTetro: '',
    activeTetroPattern : '',
    activeTetroCol : 0,
    activeTetroRow : 0,
    paused: true,
    sprint: false,

    // tetrominoes, tetrosColors => à factoriser...
    tetrominoes: {
        tetroZ: [[1,0],[1,1],[0,1]],
        tetroS: [[0,1],[1,1],[1,0]],
        tetroL: [[1,1],[1,0],[1,0]],
        tetroJ: [[1,0],[1,0],[1,1]],
        tetroI: [[1],[1],[1],[1]],
        tetroT: [[1,0],[1,1],[1,0]],
        tetroO: [[1,1],[1,1]],
    },
    tetrosColors:{
        tetroZ: 'tetris-z',
        tetroS: 'tetris-s',
        tetroL: 'tetris-l',
        tetroJ: 'tetris-j',
        tetroI: 'tetris-i',
        tetroT: 'tetris-t',
        tetroO: 'tetris-o',
    },

    reset(){
        clearInterval(tetris.intervalId)
        console.log('clr inter : ' + tetris.intervalId)
        tetris.resetRequired = true;

        document.removeEventListener('keydown', tetris.handleKeyboard)
        document.removeEventListener('keyup', tetris.handleKeyboardReleased)
        app.resetEmojiWin();
        pixel.pixelDrawColor = pixel.defaultPixelDrawColor;
        document.querySelectorAll('.pixel').forEach(function(elt)
        {         
            for (let i = elt.classList.length - 1; i >= 0; i--) {
                const className = elt.classList[i];
                if (className.includes('tetris')) {
                    elt.classList.remove(className);
                }
            }                                                           
        })
    },

    init(){
        app.initEmojiWin();
        tetris.resetRequired = false;
        tetris.delay = tetris.defaultDelay
        this.activeTetro = ''
        this.listenKeyboard()
    },
    play(){   
        if(!tetris.iamAlive || tetris.resetRequired){
            clearInterval(tetris.intervalId)
            console.log('clr inter : ' + tetris.intervalId)
            if(!tetris.iamAlive){
                alert('you lose')
                return
            }
        }
        // Si pas de tétromino actif, on en génère un nouveau aléatoire
        if(this.activeTetro === ''){
            do{ // génère un tetromino au hasard
                this.activeTetro = this.generateTetromino()  
            } while(tetris.activeTetro === tetris.previousTetro) // on ne veut pas 2 fois de suite le même tetromino
            tetris.previousTetro = tetris.activeTetro
            // Récupère les infos (dessin et couleurs) du tétromino
            this.activeTetroPattern = this.tetrominoes[this.activeTetro]
            this.activeColor = this.tetrosColors[this.activeTetro]
            // Dessine le nouveau tétromino sur la première ligne (0) et au centre (largeur de grille /2 - largeur tetro /2)
            this.drawTetromino(this.activeTetroPattern, Math.floor(grid.col/2 - this.activeTetroPattern.length / 2),0)
        } else{
            this.moveTetromino('down') 
        }
   
    },
    // Vérifie si un dessin (pattern) peut être tracé à la position indiqué (colDraw, rowDraw)
    // Si une seule zone de l'espace nécessaire au dessin est occupé par un autre tétromino ou hors de la grille, renvoi false,
    // Renvoi true si le dessin peut être réalisé
    isPositionFree(pattern, colDraw, rowDraw){
        // for (let col = 0; col < 4; col++) {
        for (let col = 0; col < pattern.length; col++) {
            // for (let row=0; row < 5; row++) {
            for (let row=0; row < pattern[0].length; row++) {
                try {
                    if(pattern[col][row]){
                        try{
                            if(pixel.pixelsArray[colDraw + col][rowDraw +row].getAttribute('isFree') === 'false'){
                                return false;
                            }
                        }
                        catch(error){
                            // error catched : tentative accès hors limite de la grille => normal: '
                            return false;
                        }
                    }    
                } catch (error) {   
                    // error catched : tentative accès hors limite du pattern => normal'
                    // Ni true, ni false, cette position ne doit pas être contrôlée 
                }
            }
        }
        return true;
    },
    drawTetromino(pattern, colDraw, rowDraw){
        tetris.activeTetroCol = colDraw
        tetris.activeTetroRow = rowDraw
            for (let col = 0; col < 4; col++) {
                for (let row=0; row < 5; row++) {
                    try {
                        if(pattern[col][row]){
                            pixel.pixelsArray[colDraw + col][rowDraw +row].classList.add('tetris--active', tetris.activeColor)
                        }    
                    } catch (error) {   
                    }
                }
            }
    },
    moveTetromino(direction){
        if(direction === 'up'){
            tetris.rotate(tetris.activeTetroPattern.slice())
         }     
         if(direction === 'left'){
            let tempPattern = tetris.activeTetroPattern.slice()
            let isFree = this.isPositionFree(tempPattern,this.activeTetroCol -1, this.activeTetroRow)
            if(isFree){
                tetris.activeTetroCol --
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern,this.activeTetroCol, this.activeTetroRow)
            }
         }
         if(direction === 'right'){
            let tempPattern = tetris.activeTetroPattern.slice()
            let isFree = this.isPositionFree(tempPattern,this.activeTetroCol +1, this.activeTetroRow)
            if(isFree){
                tetris.activeTetroCol ++
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern,this.activeTetroCol, this.activeTetroRow)
            }
         }
         if(direction === 'down'){
            let tempPattern = tetris.activeTetroPattern.slice()
            let isFree = this.isPositionFree(tempPattern,this.activeTetroCol,this.activeTetroRow + 1 )
            if(isFree ){
                tetris.activeTetroRow ++
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow) 
            } else {
                tetris.activeTetro = ''
                tetris.activeTetroCol = 0
                tetris.activeTetroRow = 0
                tetris.activeTetroPattern = ''
                tetris.freezeTetromino()
            }
         }
    },
    generateTetromino(){
        randNB = grid.randomNum(Object.keys(tetris.tetrominoes).length)
        let i = 0
        for (const tetromino in this.tetrominoes) {
            if(i===randNB){
                return this.activeTetro = tetromino
            }
            i++
        }
    },

    rotate(tetromino){
        if (tetromino != ''){
            // Rotate
            tetromino = app.transpose(tetromino.reverse())
            
            if(!this.isPositionFree(tetromino,this.activeTetroCol,this.activeTetroRow)){ 
                console.log('rotation impossible, hors limite grille')
            } else {
                // Redraw new position
                if(tetris.activeTetro === 'tetroI') {
                    if(typeof tetris.activeTetroPattern[0][1] === 'undefined'){
                        tetris.activeTetroCol ++
                    } else {
                        tetris.activeTetroCol --
                    }
                }
                tetris.eraseTetromino()
                tetris.activeTetroPattern = tetromino
                tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow)  
            }
        }
    },

    freezeTetromino(){
 
        if(tetris.iamAlive){
            document.querySelectorAll('.tetris--active').forEach(function(pixelDiv) {
                // pixelDiv.classList.remove(tetris.activeColor, 'tetris--active')
                pixelDiv.classList.remove( 'tetris--active')
                pixelDiv.classList.add('tetris--freezed')
                pixelDiv.setAttribute('isFree', 'false')
                // clearInterval(tetris.intervalId)
            })
        } 
        // check si une ligne est complète
        for(let row = 0; row < grid.row; row++){
            let rowIsComplete = true    
            for(let col = 0; col < grid.col; col++){
                if(pixel.pixelsArray[col][row].getAttribute('isFree') === 'true'){
                    // si une case de la ligne est libre, la ligne n'est pas complète
                    rowIsComplete = false
                }
            }
            if(rowIsComplete){
                let col = 0
                document.querySelectorAll('.column').forEach(column => {
                    column.removeChild(column.children[row])
                    let test = pixel.pixelsArray[col][0].cloneNode(true)
                    column.prepend(test)
                    pixel.pixelsArray[col] = column.children
                    col ++
                });
            }
         
        }
        // check si un tetromino touche le haut de la grille
        for(let i = 0; i < grid.col; i++){
        if(pixel.pixelsArray[i][0].getAttribute('isFree')=== 'false') {
            tetris.iamAlive = false
        }
        }
    },
    eraseTetromino(){
        document.querySelectorAll('.tetris--active').forEach(function(pixelDiv) {
            pixelDiv.classList.remove(tetris.activeColor, 'tetris--active')
        })
    },

    // EVENTS LISTENERS / HANDLERS
    listenKeyboard(){
        document.addEventListener('keydown', tetris.handleKeyboard)
        document.addEventListener('keyup', tetris.handleKeyboardReleased)
    },
    handleKeyboardReleased(event){
        if(event.code.substring(0,5)=== 'Arrow' && !tetris.paused){
            event.preventDefault()
            const direction = event.code.split('Arrow')
            if(direction[1].toLowerCase() === 'down'){
                console.log('down released')
                tetris.sprint = false
                clearInterval(tetris.intervalId)
                console.log('clr inter : ' + tetris.intervalId)
                if(tetris.iamAlive){
                    tetris.delay = tetris.defaultDelay
                    tetris.intervalId = setInterval(tetris.play.bind(tetris), tetris.delay)
                    console.log('set inter : ' + tetris.intervalId)
                }
            }
        }
    },
    handleKeyboard(event){
        console.log(event.code)
        if(tetris.iamAlive){
            if(event.code.substring(0,5)=== 'Arrow'  && !tetris.paused){
                event.preventDefault()
                const direction = event.code.split('Arrow')
                if(direction[1].toLowerCase() === 'down'){
                    // Si on est déjà en sprint, pas la peine de relancer l'interval
                    if(!tetris.sprint){ 
                        tetris.sprint = true
                        console.log('down pressed')
                        clearInterval(tetris.intervalId)
                        console.log('clr inter : ' + tetris.intervalId)
                        tetris.delay = tetris.sprintDelay
                        tetris.intervalId = setInterval(tetris.play.bind(tetris), tetris.delay)
                        console.log('set inter : ' + tetris.intervalId)
                    }
                }
                tetris.moveTetromino(direction[1].toLowerCase())
            }
        }
    // Gestion des autres touches
    switch (event.code) {
        case 'Escape':
        case 'Space':
            console.log(event)
            event.preventDefault()
            // Pause le jeu, a developper plus tard
            if(tetris.paused){
                tetris.paused = false
                // Si le jeu est en pause, le relance
                console.log('set inter : ' + tetris.intervalId)
                tetris.intervalId = setInterval(tetris.play.bind(tetris), tetris.delay)
                console.log('set inter : ' + tetris.intervalId)
                console.log('game resumed')
            }else{
                tetris.paused = true
                clearInterval(tetris.intervalId)
                console.log('clr inter : ' + tetris.intervalId)
                console.log('game paused')
            }
            break;
        default: 
            break;
        }   
    },
   
}
