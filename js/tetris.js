const tetris = {
    tetrominoes: {

    }


     
    
    let brick = [[1,1],[1,0],[1,0],] //tetromino L


    
    let rotate90, rotate180, rotate270
    //let brick = [[0,1],[0,1],[0,1],[0,1],] //tetromino I
   
    // let brick = [[1,0],[1,1],[0,1],] // tetromino Z
    // let brick = [[1,0],[1,1],[1,0],] //tetromino T

    // let brick = [[1,1],[1,1]] //tetromino O

    // Ca marche :
    /*   reverseBrick = invaders.flipMajorDiagonal([[1,1],[1,0],[1,0]].reverse())
    reverseBrick = invaders.flipMajorDiagonal(reverseBrick.reverse())
    reverseBrick = invaders.flipMajorDiagonal(reverseBrick.reverse()) */  

    for (let col = 0; col < brick.length+1; col++) {
    for (let row = 0; row < brick.length+1; row++) {
        try {
            if(brick[col][row]){
                pixel.pixelsArray[col][row].classList.add('red')
            }    
        } catch (error) {
            
        }
        
    }
    }
    //rotate90  = invaders.flipMajorDiagonal(brick.reverse())
    rotate90  = g2048.transpose(brick.reverse())
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
    rotate180 = g2048.transpose(rotate90.reverse())
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
    rotate270 = g2048.transpose(rotate180.reverse())
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

}