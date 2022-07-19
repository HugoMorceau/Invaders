
const tetris = {
    intervalId:0,
    iamAlive: true,
    resetRequired: false,
    defaultDelay: 500,
    sprintDelay: 35,
    delay: 500,
    previousTetro: '',
    activeTetro: '',
    activeTetroPattern : '',
    activeTetroCol : 0,
    activeTetroRow : 0,
    // defaultPixel = pixel.pixelDiv,

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
        if(!tetris.iamAlive || tetris.resetRequired){
            clearInterval(tetris.intervalId)
            if(!tetris.iamAlive){
                alert('you lose')
                return
            }
        }

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
                            if(pixel.pixelsArray[0][2].classList.length > 3 ){
                                console.log('break here')
                            }
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
 
        if(tetris.iamAlive){
            document.querySelectorAll('.tetris--active').forEach(function(pixelDiv) {
                pixelDiv.classList.remove(tetris.activeColor, 'tetris--active')
                pixelDiv.classList.add('darkgrey')
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
                // la ligne est complète, on la supprime
            /*     document.querySelectorAll('[data-row="'+row+'"').forEach(element => {
                    element.remove()
                }); */ 
            /*     for (let col = 0; col < grid.col; col++) {
                    pixel.pixelsArray[col].splice(0,1)
                    
                } */
                let col = 0
                document.querySelectorAll('.column').forEach(column => {

                    column.removeChild(column.children[row])
                    let test = pixel.pixelsArray[col][0].cloneNode(true)
                    test.classList.add('red')
                    column.prepend(test)
                    // pixel.pixelsArray[col].splice(0,1)
                    pixel.pixelsArray[col] = column.children
                    // column.prepend(pixel.pixelsArray[col][0].cloneNode(true))
                    col ++
                });

            /*     let col = 0
                document.querySelectorAll('[data-row="1"').forEach(element => {
                    element.parentNode.prepend(pixel.pixelsArray[col][0].cloneNode(true))
                    element.remove()
                    // pixel.pixelsArray[col][0].classList.add('red')
                    
                    col++
                }); */
            }
         

        }

        // check si un tetromino touche le haut de la grille
        for(let i = 0; i < grid.col; i++){
        if(pixel.pixelsArray[i][0].getAttribute('isFree')=== 'false') {
            tetris.iamAlive = false
            //clearInterval(tetris.intervalId)
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
        if(event.code.substring(0,5)=== 'Arrow'){
            event.preventDefault()
            const direction = event.code.split('Arrow')
            if(direction[1].toLowerCase() === 'down'){
                clearInterval(tetris.intervalId)
                if(tetris.iamAlive){
                    tetris.delay = tetris.defaultDelay
                    tetris.intervalId = setInterval(tetris.play.bind(tetris), tetris.delay)
                }
            }
        }
    },
    handleKeyboard(event){
        console.log(event.code)
        if(tetris.iamAlive){
            if(event.code.substring(0,5)=== 'Arrow'){
                event.preventDefault()
                const direction = event.code.split('Arrow')
                if(direction[1].toLowerCase() === 'down'){
                    clearInterval(tetris.intervalId)
                    tetris.delay = tetris.sprintDelay
                    tetris.intervalId = setInterval(tetris.play.bind(tetris), tetris.delay)
                }
                if(direction[1].toLowerCase() === 'up'){
                    tetris.rotate(tetris.activeTetroPattern.slice())
                } else {
                    tetris.moveTetromino(direction[1].toLowerCase())
                }
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
