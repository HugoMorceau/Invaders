const snake = {
    iamAlive: true,
    defaultSnakeSize: 3,
    snakeSize: 0,
    snakeSpeed: 1,
    snakeColor: 'darkgrey',
    posHead: [0,0],
    snakeTailPos: [0,0],
    snakeBody: [],
    direction: 'Left',
    lastDirection : 'Left',
    difficulty: [1,2,3],
    ratPos: [0,0],
    ratColor: 'red',
    delay: 300, 

    init(){
        
        console.log('Init Snake start') // debug
        this.snakeSize = this.defaultSnakeSize
        this.listenKeyboard()
        let col = Math.round(grid.gridSize/2) 
        let row = Math.floor(grid.gridSize/2) 
        let i = 0
        while(i < this.snakeSize){
            this.drawSnake(col,row)
            if(!i){
                // première itération, queue du serpent
                 this.snakeTailPos = [col,row]
             }
            if(i=== this.snakeSize - 1){
                // dernière itération, tête du serpent
                this.posHead = [col,row]         
            }
            col--
            i++
        }
        this.drawRat();

        setTimeout(this.play, this.delay)
        console.log('Init Snake done') // debug
    },
    reset(){
        console.log('Reset Snake done') // debug
    },
    listenKeyboard(){
        document.addEventListener('keydown', snake.handleKeyboard)
    },
    handleKeyboard(event){
        console.log(event.code)
        if(event.code.substring(0,5)=== 'Arrow'){
            event.preventDefault()
            const direction = event.code.split('Arrow')
            snake.direction = direction[1]
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

    play(){      
        if(snake.iamAlive){
            // snake.iamAlive = snake.moveSnake(this.Direction)
            snake.moveSnake(snake.direction)
            setTimeout(snake.play, snake.delay)           
        }else{
            alert('you lose')
        }
    },
    moveSnake(direction){ // async 
        console.log('Position tête : ' + this.posHead)
        console.log('move snake ' + direction   )
        let translatedDirection = this.translateDirection(this.direction)
        // on déplace la tête du serpent
        let snakeHeadcol = snake.posHead[0]
        let snakeHeadrow = snake.posHead[1]
        snakeHeadcol = snakeHeadcol + translatedDirection[0]
        snakeHeadrow = snakeHeadrow + translatedDirection[1]
        // analyse de la prochaine position de la tête
        let pix = ''
        try {
            pix = pixel.pixelsArray[snakeHeadcol][snakeHeadrow]
            // Si on va dans le mur ou dans le serpent, on perd
            pixIs = this.whatIsThisPix(pix)
        } catch (error) {
            if (error instanceof TypeError){
                console.log('error catched for Type Error')
                pixIs = 'wall'
                console.log('dans le mur')
                snake.iamAlive = false
                return
            }
        }
        console.log('Position tête : ' + this.posHead)
        if (pixIs === 'snake') {
                // Le serpent ne peut pas recule
                if(this.snakeBody[1] === pix){ 
                    console.log('annule direction')
                    // on annule la dernière direction  
                    console.log('last dir = ' + snake.lastDirection)             
                    snake.direction = snake.lastDirection
                    this.moveSnake(snake.direction)
                    return;
                } else{
                    console.log('dans le snake')
                    snake.iamAlive = false
                    return;
                }
        } 
        if (pixIs === 'rat') {
            console.log('Le snake mange le rat')
        }
        if(pixIs === 'wall'){
            console.log('dans le mur')
            snake.iamAlive = false
            return;
        }

        // Dessine la nouvelle position 
        this.drawSnake(snakeHeadcol,snakeHeadrow)
        this.posHead = [snakeHeadcol,snakeHeadrow]
        if(pixIs === 'rat'){
            // On fait pop un nouveau rat si le précédent est mangé
            this.drawRat();
        } else {
            // On supprime le bout de la queue du serpent
            this.eraseSnake(this.snakeBody.pop())
        }
        snake.lastDirection = snake.direction
        return true;
    },
  
    drawSnake(col,row){
        console.log('draw snake : ')
        
        const pix = pixel.pixelsArray[col][row]
        console.log( pix )
        pix.classList.remove(pixel.defaultPixelDrawColor)
        pix.classList.remove(this.ratColor)
        pix.classList.add(this.snakeColor)
        this.snakeBody.unshift(pix)
        
    },
    eraseSnake(pix){//col,row){
        // const pix = pixel.pixelsArray[col][row]
        pix.classList.remove(this.snakeColor)
        pix.classList.add(pixel.defaultPixelDrawColor)
    },

    whatIsThisPix(pix){
        if(typeof pix === 'undefined'){
            return 'wall'
        }
        if(pix.classList.contains(this.snakeColor)){
            return 'snake';
        }
        if(pix.classList.contains(this.ratColor)){
            return 'rat';
        }
        return 'free';
    },
    drawRat(){
        let i = 0;
        do{
            i++
            col = grid.randomNum()
            row = grid.randomNum() 
            this.ratPos = [col,row]
            ratPix = pixel.pixelsArray[col][row]
         } while(this.whatIsThisPix(ratPix) != 'free')

        ratPix.classList.remove(ratPix.classList[1])
        ratPix.classList.add(this.ratColor)
    },
    translateDirection(direction){
        // direction haut bas gauche droite
        switch (direction) {
            case 'Up':
                return [0, -1];
 
            case 'Down':
                return [0, +1];
 
            case 'Right':
                return [+1, 0];
 
            case 'Left':
                return [-1, 0];
        }
    },
}


  
  
 