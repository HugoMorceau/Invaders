

const tetris = {
    
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
        
    },

    Play(){
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
            for (let col = 0; col < 5; col++) {
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
