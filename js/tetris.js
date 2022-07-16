

const tetris = {
    Tetromino : class Tetromino {
        constructor(oname, pattern) {
            this.name = oname;
            this.pattern = pattern;
        }
    
         rotate(){
            this.name = 'test rename';
        } 
    },
    tetrominoes: [],
   
    init(){

        this.tetrominoes = [ 
            new this.Tetromino('l' ,'z'),
            new this.Tetromino('tetromino L', [[1,1],[1,0],[1,0],]),
            new this.Tetromino('tetromino Z', [[1,0],[1,1],[0,1],]),
            new this.Tetromino('tetromino I', [[0,1],[0,1],[0,1],[0,1],]),
            new this.Tetromino('tetromino T', [[1,0],[1,1],[1,0],]),
            new this.Tetromino('tetromino O', [[1,1],[1,1]]),
        ]
         // j et s
         this.tetrominoes[0].rotate()


        this.Play()

    },
    reset(){
    },

    Play(){
    },
    functionTempToRemove(){
// Ca marche :
    /*   reverseBrick = invaders.flipMajorDiagonal([[1,1],[1,0],[1,0]].reverse())
    reverseBrick = invaders.flipMajorDiagonal(reverseBrick.reverse())
    reverseBrick = invaders.flipMajorDiagonal(reverseBrick.reverse()) */  
    let rotate90, rotate180, rotate270
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 5; row++) {
            try {
                if(tetris.tetrominoes[0].pattern[col][row]){
                    pixel.pixelsArray[col][row].classList.add('red')
                }    
            } catch (error) {
                
            }
            
        }
        }
        //rotate90  = invaders.flipMajorDiagonal(brick.reverse())
        rotate90  = app.transpose(tetris.tetroL.pattern[col][row].reverse())
        console.log(rotate90)
        console.log(rotate90.length)
        for (let col = 0; col < rotate90.length+2; col++) {
        for (let row = 0; row < rotate90.length+3; row++) {
            try {
                if(rotate90[col][row]){
                    pixel.pixelsArray[col][row +5].classList.add('red')
                }    
            } catch (error) {
                
            }
            
        }
        }
        rotate180 = app.transpose(rotate90.reverse())
        for (let col = 0; col < rotate180.length+1; col++) {
        for (let row = 0; row < rotate180.length+2; row++) {
            try {
                if(rotate180[col][row]){
                    pixel.pixelsArray[col][row +11].classList.add('red')
                }    
            } catch (error) {
                
            }
            
        }
        }
        rotate270 = app.transpose(rotate180.reverse())
        for (let col = 0; col < rotate270.length+2; col++) {
        for (let row = 0; row < rotate270.length+2; row++) {
            try {
                if(rotate270[col][row]){
                    pixel.pixelsArray[col][row +15].classList.add('red')
                }    
            } catch (error) {
                
            }
            
        }
        } 
    },
    
}
