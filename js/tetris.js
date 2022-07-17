
const tetris = {
    intervalId:0,
    iamAlive: true,
    resetRequired: false,
    delay: 500,
    previousTetro: '',
    currentTetro: '',
    currentTetroPattern : '',

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
    },

    init(){
        this.currentTetro = ''
        tetris.intervalId = setInterval(tetris.play.bind(this), tetris.delay)
    },
    play(){   
        // Si pas de piece courante
        //  gènere une nouvelle pièce aléatoire 
        //  desinne la pièce sur la grille
        //Sinon
        // efface la pièce courante
        // faire descendre la pièce courante d'une ligne
        if(this.currentTetro === ''){
            let currentCol, currentRow = 0;
            do{
                this.currentTetro = this.generateTetromino()

            } while(tetris.currentTetro === tetris.previousTetro)
            this.currentTetroPattern = this.tetrominoes[this.currentTetro]
            this.drawTetromino(this.currentTetroPattern, Math.floor(grid.col/2 - this.currentTetroPattern.length / 2),0)
        }

        if(!tetris.iamAlive || tetris.resetRequired){
            clearInterval(tetris.intervalId)
            if(!tetris.iamAlive){
                alert('you lose')
            }
        }
    },
    drawTetromino(pattern, coldraw, rowdraw){
        console.log(pattern)
            for (let col = 0; col < 4; col++) {
                for (let row=0; row < 5; row++) {
                // console.log('TetroZ col' +col + ' Row ' + row  + ' Valeur =' + this.tetroZ[col][row] )
                    try {
                        console.log(pattern[col][row])
                        if(pattern[col][row]){
                            pixel.pixelsArray[coldraw + col][rowdraw +row].classList.add('red')
                        }    
                    } catch (error) {   
                    }
                }
            }
    },
    moveTetromino(){

    },
    generateTetromino(){
        randNB = grid.randomNum(Object.keys(tetris.tetrominoes).length)
        console.log(randNB)
        let i = 0
        for (const tetromino in this.tetrominoes) {
            if(i===randNB){
                return this.currentTetro = tetromino
                //this.currentTetroPattern = tetris.tetrominoes[tetromino]
                console.log (this.currentTetro)
                console.log(this.currentTetroPattern)
                break;
            }
            i++
        }
    },

    rotate(tetromino){
        app.transpose(tetromino.reverse())
    } ,



    // To be removed
    drawAllTetrominoes(){ // just for testing
        let rowDraw = 0
        for (const tetromino in this.tetrominoes) {
            tetrotemp = this.tetrominoes[tetromino]
            console.log(tetrotemp)
            let colDraw   = 0  
            for (let i = 0; i < 4; i++) {
            for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 5; row++) {
                // console.log('TetroZ col' +col + ' Row ' + row  + ' Valeur =' + this.tetroZ[col][row] )
                    try {
                        if(tetrotemp[col][row]){
                            pixel.pixelsArray[colDraw + col][rowDraw + row].classList.add('red')
                        }    
                    } catch (error) {
                        
                    }
                    
                }
            }
            tetrotemp = app.transpose(tetrotemp.reverse())
            colDraw +=5
            }
            rowDraw +=5
        }
         console.log(this.tetroZ)

    },
   
}
