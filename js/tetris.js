
const tetris = {
    intervalId:0,
    iamAlive: true,
    resetRequired: false,
    delay: 500,
    previousTetro: '',
    activeTetro: '',
    activeTetroPattern : '',
    activeTetroCol : 0,
    activeTetroRow : 0,

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
        tetroZ: 'red',
        tetroS: 'green',
        tetroL: 'tetris-blue',
        tetroJ: 'orange',
        tetroI: 'tetris-cyan',
        tetroT: 'tetris-darkGreen',
        tetroO: 'lightOrange',
    },

    reset(){
        clearInterval(tetris.intervalId)

    },

    init(){
        this.activeTetro = ''
        tetris.intervalId = setInterval(tetris.play.bind(this), tetris.delay)
        this.listenKeyboard()
    },
    play(){   

        if(this.activeTetro === ''){
            do{
                this.activeTetro = this.generateTetromino()

            } while(tetris.activeTetro === tetris.previousTetro)
            this.activeTetroPattern = this.tetrominoes[this.activeTetro]
            this.activeColor = this.tetrosColors[this.activeTetro]
            this.drawTetromino(this.activeTetroPattern, Math.floor(grid.col/2 - this.activeTetroPattern.length / 2),0)
            console.log(tetris.activeColor)
        } else{
            this.moveTetromino('down') 
        }

        if(!tetris.iamAlive || tetris.resetRequired){
            clearInterval(tetris.intervalId)
            if(!tetris.iamAlive){
                alert('you lose')
            }
        }
    },
    isPositionFree(pattern, colDraw, rowDraw){
        for (let col = 0; col < 4; col++) {
            for (let row=0; row < 5; row++) {
                try {
                    if(pattern[col][row]){
                        try{
                            if(pixel.pixelsArray[colDraw + col][rowDraw +row].getAttribute('isFree') === 'false'){
                                return false;
                            }
                        }
                        catch(error){
                            console.log(error)
                            console.log('error catched : tentative accès hors limite de la grille : ')
                            console.log('colDraw:' + colDraw + ' col:' +col + ' row:Draw' + rowDraw + ' row:' + row )
                            return false;
                        }
                    }    
                } catch (error) {   
                    console.log('error catched : tentative accès hors limite du pattern => normal')
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
            // tetris.eraseTetromino()
         }
         if(direction === 'left'){   
             
             if(tetris.activeTetroCol > 0){
                tetris.activeTetroCol --
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow)
            } else{
                tetris.activeTetroCol ++
            }
         }
         if(direction === 'right'){
            
            if(tetris.activeTetroCol + this.activeTetroPattern.length  < grid.col){
                tetris.activeTetroCol ++
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow)  
            } else{
                tetris.activeTetroCol -- 
            }
         }
         if(direction === 'down'){
            const tempPattern = tetris.activeTetroPattern.slice()
            const isFree = this.isPositionFree(tempPattern,this.activeTetroCol,this.activeTetroRow + 1 )
            if(isFree ){ //&& tetris.activeTetroRow + tetris.activeTetroPattern[0].length < grid.row
                tetris.activeTetroRow ++
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow) 
            } else {
                tetris.activeTetro = ''
                tetris.activeTetroCol = 0
                tetris.activeTetroRow = 0
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
        // Rotate
        tetromino = app.transpose(tetromino.reverse())
        // if (tetris.activeTetroCol + tetromino.length  > grid.col || tetris.activeTetroCol < 0 ){
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
    },

    freezeTetromino(){
        document.querySelectorAll('.tetris--active').forEach(function(pixelDiv) {
            pixelDiv.classList.remove(tetris.activeColor, 'tetris--active')
            pixelDiv.classList.add('darkgrey')
            pixelDiv.setAttribute('isFree', 'false')
        })
        // check si un tetromino touche le haut de la grille
        for(let i = 0; i < grid.col; i++){
             if(pixel.pixelsArray[i][0].getAttribute('isFree')=== 'false') {
                tetris.iamAlive = false
                clearInterval(tetris.intervalId)
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
    },
    handleKeyboard(event){
        console.log(event.code)
        if(event.code.substring(0,5)=== 'Arrow'){
            event.preventDefault()
            const direction = event.code.split('Arrow')
            if(direction[1].toLowerCase() === 'up'){
                tetris.rotate(tetris.activeTetroPattern.slice())
            } else {
                tetris.moveTetromino(direction[1].toLowerCase())
            }
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
