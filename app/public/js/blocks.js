
const blocks = {
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
    level: 0,
    completedLines: 0,
    score: 0,

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
        tetroZ: 'blocks-z',
        tetroS: 'blocks-s',
        tetroL: 'blocks-l',
        tetroJ: 'blocks-j',
        tetroI: 'blocks-i',
        tetroT: 'blocks-t',
        tetroO: 'blocks-o',
    },

    reset(){
        clearInterval(blocks.intervalId)
        console.log('clr inter : ' + blocks.intervalId)
        blocks.resetRequired = true;
        document.querySelector('.config').classList.add('hide');
        document.getElementById('clearBtn').classList.add('hide');
        document.getElementById("difficulty").classList.add('hide');   
        document.getElementById("startBtn").classList.add('hide') 
        document.getElementById("pauseBtn").classList.add('hide') 
        document.removeEventListener('keydown', blocks.handleKeyboard)
        document.removeEventListener('keyup', blocks.handleKeyboardReleased)
        app.resetEmojiWin();
        pixel.pixelDrawColor = pixel.defaultPixelDrawColor;
        document.querySelectorAll('.pixel').forEach(function(elt)
        {         
            for (let i = elt.classList.length - 1; i >= 0; i--) {
                const className = elt.classList[i];
                if (className.includes('blocks')) {
                    elt.classList.remove(className);
                }
            }                                                           
        })
    },

    init(){
        app.initEmojiWin();
        blocks.resetRequired = false;
        blocks.delay = blocks.defaultDelay
        document.getElementById("startBtn").classList.remove('hide') 
        document.getElementById("pauseBtn").classList.remove('hide') 
        this.activeTetro = ''
        this.listen()
    },
    play(){   
        if(!blocks.iamAlive || blocks.resetRequired){
            clearInterval(blocks.intervalId)
            console.log('clr inter : ' + blocks.intervalId)
            if(!blocks.iamAlive){
                alert('you lose')
                return
            }
        }
        // Si pas de tétromino actif, on en génère un nouveau aléatoire
        if(this.activeTetro === ''){
            do{ 
                this.activeTetro = this.generateTetromino()  
            } while(blocks.activeTetro === blocks.previousTetro) // on ne veut pas 2 fois de suite le même tetromino
            blocks.previousTetro = blocks.activeTetro
            // Récupère les infos (dessin et couleurs) du tétromino
            this.activeTetroPattern = this.tetrominoes[this.activeTetro]
            this.activeColor = this.tetrosColors[this.activeTetro]
            // Dessine le nouveau tétromino sur la première ligne (0) et au centre (largeur de grille /2 - largeur tetro /2)
            this.drawTetromino(this.activeTetroPattern, Math.floor(grid.col/2 - this.activeTetroPattern.length / 2),0)
        } else{
            // Si tétromino actif, il tombe
            this.moveTetromino('down') 
        }
    },
    // Vérifie si un dessin (pattern) peut être tracé à la position indiquée (colDraw, rowDraw)
    // Si une seule zone de l'espace nécessaire au dessin est occupée par un autre tétromino ou hors de la grille, renvoi false,
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
        blocks.activeTetroCol = colDraw
        blocks.activeTetroRow = rowDraw
            for (let col = 0; col < 4; col++) {
                for (let row=0; row < 5; row++) {
                    try {
                        if(pattern[col][row]){
                            pixel.pixelsArray[colDraw + col][rowDraw +row].classList.add('blocks--active', blocks.activeColor)
                        }    
                    } catch (error) {   
                    }
                }
            }
    },
    moveTetromino(direction){
        if(direction === 'up'){
            blocks.rotate(blocks.activeTetroPattern.slice())
         }     
         if(direction === 'left'){
            let tempPattern = blocks.activeTetroPattern.slice()
            let isFree = this.isPositionFree(tempPattern,this.activeTetroCol -1, this.activeTetroRow)
            if(isFree){
                blocks.activeTetroCol --
                blocks.eraseTetromino()
                blocks.drawTetromino(blocks.activeTetroPattern,this.activeTetroCol, this.activeTetroRow)
            }
         }
         if(direction === 'right'){
            let tempPattern = blocks.activeTetroPattern.slice()
            let isFree = this.isPositionFree(tempPattern,this.activeTetroCol +1, this.activeTetroRow)
            if(isFree){
                blocks.activeTetroCol ++
                blocks.eraseTetromino()
                blocks.drawTetromino(blocks.activeTetroPattern,this.activeTetroCol, this.activeTetroRow)
            }
         }
         if(direction === 'down'){
            let tempPattern = blocks.activeTetroPattern.slice()
            let isFree = this.isPositionFree(tempPattern,this.activeTetroCol,this.activeTetroRow + 1 )
            if(isFree ){
                // La prochaine position est libre, le tétromino "tombe" d'une ligne
                blocks.activeTetroRow ++
                blocks.eraseTetromino()
                blocks.drawTetromino(blocks.activeTetroPattern, blocks.activeTetroCol, blocks.activeTetroRow) 
            } else {
                // La prochaine position n'est pas libre, le tétromino est figé à sa position actuelle
                blocks.activeTetro = ''
                blocks.activeTetroCol = 0
                blocks.activeTetroRow = 0
                blocks.activeTetroPattern = ''
                blocks.freezeTetromino()
            }
         }
    },
    generateTetromino(){
        randNB = grid.randomNum(Object.keys(blocks.tetrominoes).length)
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
                if(blocks.activeTetro === 'tetroI') {
                    if(typeof blocks.activeTetroPattern[0][1] === 'undefined'){
                        blocks.activeTetroCol ++
                    } else {
                        blocks.activeTetroCol --
                    }
                }
                blocks.eraseTetromino()
                blocks.activeTetroPattern = tetromino
                blocks.drawTetromino(blocks.activeTetroPattern, blocks.activeTetroCol, blocks.activeTetroRow)  
            }
        }
    },

    freezeTetromino(){
 
        if(blocks.iamAlive){
            document.querySelectorAll('.blocks--active').forEach(function(pixelDiv) {
                // pixelDiv.classList.remove(blocks.activeColor, 'blocks--active')
                pixelDiv.classList.remove( 'blocks--active')
                pixelDiv.classList.add('blocks--freezed')
                pixelDiv.setAttribute('isFree', 'false')
                // clearInterval(blocks.intervalId)
            })
        } 
        let completedRow = 0
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
                completedRow ++
                let col = 0
                document.querySelectorAll('.column').forEach(column => {
                    // On supprime chaque pixel de la ligne
                    column.removeChild(column.children[row])
                    // On ajoute une ligne vierge pixel par pixel
                    let newRowPix = pixel.pixelsArray[col][0].cloneNode(true)
                    column.prepend(newRowPix)
                    pixel.pixelsArray[col] = column.children
                    col ++
                    console.log('lines completed : ' +blocks.completedLines)
                });        
            }
        }
        blocks.completedLines += completedRow
        // Level up si score atteint
        if(blocks.completedLines >= (blocks.level + 1) * 7 ){
            blocks.level ++
            clearInterval(blocks.intervalId)
            blocks.delay = Math.floor(blocks.delay * 0.91)
            blocks.intervalId = setInterval(blocks.play.bind(blocks), blocks.delay)
            alert('level up : ' + blocks.level)
            console.log('delay : ' +blocks.delay)
        }
        // Si au moins une ligne complétée, on augmente le score
        switch (completedRow) {
            case 1:
                blocks.score += (40 * (blocks.level + 1))
                break;
            case 2:
                blocks.score += (100 * (blocks.level + 1))
                break;
            case 3:
                blocks.score += (300 * (blocks.level + 1))
                break;
            case 4:
                blocks.score += (1200 * (blocks.level + 1))
                break;
            default:
                break;
        }
        console.log(blocks.score)
        
        // check si un tetromino touche le haut de la grille
        for(let i = 0; i < grid.col; i++){
        if(pixel.pixelsArray[i][0].getAttribute('isFree')=== 'false') {
            blocks.iamAlive = false
        }
        }
    },
    eraseTetromino(){
        document.querySelectorAll('.blocks--active').forEach(function(pixelDiv) {
            pixelDiv.classList.remove(blocks.activeColor, 'blocks--active')
        })
    },

    // EVENTS LISTENERS / HANDLERS
    listen(){
        document.addEventListener('keydown', blocks.handleKeyboard)
        document.addEventListener('keyup', blocks.handleKeyboardReleased)
        // document.getElementById('pauseBtn').addEventListener('click', blocks.gameState)
        document.getElementById('pauseBtn').addEventListener('click', () => blocks.gameState('pause'))
        document.getElementById('startBtn').addEventListener('click', () => blocks.gameState('start'))
    },
    handleKeyboardReleased(event){
        if(event.code.substring(0,5)=== 'Arrow' && !blocks.paused){
            event.preventDefault()
            const direction = event.code.split('Arrow')
            if(direction[1].toLowerCase() === 'down'){
                console.log('down released')
                blocks.sprint = false
                clearInterval(blocks.intervalId)
                console.log('clr inter : ' + blocks.intervalId)
                if(blocks.iamAlive){
                    blocks.intervalId = setInterval(blocks.play.bind(blocks), blocks.delay)
                    console.log('set inter : ' + blocks.intervalId)
                }
            }
        }
    },
    gameState(state){
        console.log('game state : ' + blocks.paused)
        if(state==='start' && blocks.paused){
            blocks.paused = false
            // Si le jeu est en pause, le relance
            console.log('set inter : ' + blocks.intervalId)
            blocks.intervalId = setInterval(blocks.play.bind(blocks), blocks.delay)
            console.log('set inter : ' + blocks.intervalId)
            console.log('game resumed')
        }
        if(state==='pause' && !blocks.paused){
            blocks.paused = true
            clearInterval(blocks.intervalId)
            console.log('clr inter : ' + blocks.intervalId)
            console.log('game paused')
        }
    },
    handleKeyboard(event){
        console.log(event.code)
        if(blocks.iamAlive){
            if(event.code.substring(0,5)=== 'Arrow'  && !blocks.paused){
                event.preventDefault()
                const direction = event.code.split('Arrow')
                if(direction[1].toLowerCase() === 'down'){
                    // Si on est déjà en sprint, pas la peine de relancer l'interval
                    if(!blocks.sprint){ 
                        blocks.sprint = true
                        console.log('down pressed')
                        clearInterval(blocks.intervalId)
                        console.log('clr inter : ' + blocks.intervalId)
                        blocks.intervalId = setInterval(blocks.play.bind(blocks), blocks.sprintDelay)
                        console.log('set inter : ' + blocks.intervalId)
                    }
                }
                blocks.moveTetromino(direction[1].toLowerCase())
            }
        }

    // Gestion des autres touches
    switch (event.code) {
        case 'Escape':
        case 'Space':
            console.log(event)
            event.preventDefault()
            // Pause le jeu, a developper plus tard
            if(blocks.paused){
                blocks.paused = false
                // Si le jeu est en pause, le relance
                console.log('set inter : ' + blocks.intervalId)
                blocks.intervalId = setInterval(blocks.play.bind(blocks), blocks.delay)
                console.log('set inter : ' + blocks.intervalId)
                console.log('game resumed')
            }else{
                blocks.paused = true
                clearInterval(blocks.intervalId)
                console.log('clr inter : ' + blocks.intervalId)
                console.log('game paused')
            }
            break;
        default: 
            break;
        }   
    },
   
}
