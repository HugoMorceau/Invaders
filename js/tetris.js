
const tetris = {
    intervalId:0,
    iamAlive: true,
    resetRequired: false,
    delay: 250,
    previousTetro: '',
    activeTetro: '',
    activeTetroPattern : '',
    activeTetroCol : 0,
    activeTetroRow : 0,

    tetrominoes: {
        tetroZ: [[1,0],[1,1],[0,1]],
        tetroS: [[0,1],[1,1],[1,0]],
        tetroL: [[1,1],[1,0],[1,0]],
        tetroJ: [[1,0],[1,0],[1,1]],
        // tetroI: [[1,0],[1,0],[1,0],[1,0]],
        tetroI: [[1],[1],[1],[1]],
        tetroT: [[1,0],[1,1],[1,0]],
        tetroO: [[1,1],[1,1]],
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
            let activeCol, activeRow = 0;
            do{
                this.activeTetro = this.generateTetromino()

            } while(tetris.activeTetro === tetris.previousTetro)
            this.activeTetroPattern = this.tetrominoes[this.activeTetro]
            this.drawTetromino(this.activeTetroPattern, Math.floor(grid.col/2 - this.activeTetroPattern.length / 2),5)
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
    drawTetromino(pattern, colDraw, rowDraw){
        console.log(pattern)
        tetris.activeTetroCol = colDraw
        tetris.activeTetroRow = rowDraw
            for (let col = 0; col < 4; col++) {
                for (let row=0; row < 5; row++) {
                    try {
                        console.log(pattern[col][row])
                        if(pattern[col][row]){
                            pixel.pixelsArray[colDraw + col][rowDraw +row].classList.add('red', 'tetris--active')
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
            let isFree = true
            for (let i = 0; i < tetris.activeTetroPattern.length; i++) {
                let row = this.activeTetroRow + 1 + tetris.activeTetroPattern[0].length
                attrFree = pixel.pixelsArray[tetris.activeTetroCol][row].getAttribute('isFree')
                if(!attrFree){
                    isFree = false
                }
            }
            if(isFree && tetris.activeTetroRow + tetris.activeTetroPattern[0].length < grid.row){
                tetris.activeTetroRow ++
                tetris.eraseTetromino()
                tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow) 
            } else {
                tetris.activeTetro = ''
                tetris.activeTetroCol = 0
                tetris.activeTetroRow = 0
                this.freezeTetromino()
            }
         }
    },
    generateTetromino(){
        randNB = grid.randomNum(Object.keys(tetris.tetrominoes).length)
        console.log(randNB)
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
    

        if (tetris.activeTetroCol + tetromino.length  > grid.col || tetris.activeTetroCol < 0 ){
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
            console.log('array de tetris : ')
            console.log(tetris.activeTetroPattern)
            console.log('array du slice : ')
            console.log(tetromino)
            tetris.drawTetromino(tetris.activeTetroPattern, tetris.activeTetroCol, tetris.activeTetroRow)  
        }
    },

    freezeTetromino(){
        document.querySelectorAll('.tetris--active').forEach(function(pixelDiv) {
            pixelDiv.classList.remove('red', 'tetris--active')
            pixelDiv.classList.add('orange')
            pixelDiv.setAttribute('isFree', 'false')
        })
    },
    eraseTetromino(){
        document.querySelectorAll('.tetris--active').forEach(function(pixelDiv) {
            pixelDiv.classList.remove('red', 'tetris--active')
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
