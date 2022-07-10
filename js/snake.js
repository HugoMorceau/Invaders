const snake = {
    /* game */
    mode: 'default',
    // mode: 'borderless',
    iamAlive: true,
    defaultSnakeSize: 3,
    difficulty: [1,2,3],
    delay: 300, 
    /* snake */
    snakeSize: 0,
    snakeSpeed: 1,
    snakeColor: 'darkgrey',
    posHead: [0,0],
    snakeTailPos: [0,0],
    snakeBody: [],
    /* rat  */
    ratPos: [0,0],
    ratColor: 'red',
    /* move */
    nextPosition: '',
    nextPosCol: '',
    nextPosRow: '',
    nextPositionType: '',
    direction: 'left',
    lastDirection : 'left',
    timeoutId : 0,
    timeoutIdCallBack : 0,
    resetRequired: false,

    init(){
        this.direction = 'left'
        this.iamAlive = true
        this.resetRequired = false;
        console.log('Init Snake start') // debug
        app.initEmojiWin();
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
        this.timeoutId = setTimeout(this.play, this.delay)

        console.log(this.timeoutId)
        console.log('Init Snake done') // debug
    },
    reset(){
        this.resetRequired = true;
        grid.init();
        app.resetEmojiWin();
        snake.snakeBody = []
        console.log('Reset Snake done') // debug
    },

    play(){      
        if(snake.resetRequired) {
            console.log('RESET REQUIRED PLAY 1')
            return;
        }
        if(snake.iamAlive){
            snake.moveSnake()
            this.timeoutIdCallBack = setTimeout(snake.play, snake.delay)           
        }else{
            alert('you lose')
        }
    },
    setNextPosition(){
        const translatedDirection = this.translateDirection(this.direction)
        // Détermine la prochaine position en fonction de la direction et de la position de départ (=la tête du serpent)
        this.nextPosCol = snake.posHead[0] + translatedDirection[0]
        this.nextPosRow = snake.posHead[1] + translatedDirection[1]
        try {
            // On essaye dé recupérer le pixel associé à la prochaine position
            snake.nextPosition = pixel.pixelsArray[this.nextPosCol][this.nextPosRow]
            snake.nextPositionType = this.whatIsThisPix(snake.nextPosition)
        } catch (error) {
            if (error instanceof TypeError){ // la prochaine position est hors des limites de la grille
                console.log('error catched for Type Error in snake.setNextPosition()')
                console.log('dans le mur')
                pixIs = 'wall'
                if(snake.mode === 'borderless'){
                    this.goThroughWall()
                }else {
                    this.iamAlive = false
                }
            }
        }
    },
    goThroughWall(){
        if(this.direction === 'left', 'right'){
            if (this.nextPosRow < 0){
                this.nextPosRow = gridSize
            }else {this.nextPosRow = 0}
        }else{
            if (this.nextPosCol < 0){
                this.nextPosCol = gridSize
            }else {this.nextPosCol= 0}
        }
        pixel.pixelsArray[this.nextPosCol][this.nextPosRow]
    },
    moveSnake(){  
        if(this.resetRequired) {
            console.log('RESET REQUIRED MOVE SNAKE')
            return;
        }
        console.log('Position tête : ' + this.posHead)
        console.log('move snake ' + this.direction   )
        this.setNextPosition()
        if(!this.iamAlive){
            return;
        }
        if (this.nextPositionType === 'snake') {
                // Le serpent ne peut pas reculer
                if(this.snakeBody[1] === pix){ 
                    console.log('annule direction')
                    // on annule la dernière direction  
                    console.log('last dir = ' + snake.lastDirection)             
                    snake.direction = snake.lastDirection
                    // on rapelle directement moveSnake pour court-circuiter le timeOut
                    // et éviter d'avoir un double délai à cause du return
                    this.moveSnake(snake.direction)
                    return;
                } else{
                    console.log('dans le snake')
                    snake.iamAlive = false
                    return;
                }
        } 
        if (this.nextPositionType === 'rat') {
            console.log('Le snake mange le rat')
        }
        if(this.nextPositionType === 'wall'){
            if(this.mode === 'borderless'){
                this.goThroughWall()
            }
            else{
                console.log('dans le mur')
                snake.iamAlive = false
                return;
            }
        }

        // Dessine la nouvelle position 
        this.drawSnake(this.nextPosCol,this.nextPosRow)
        this.posHead = [this.nextPosCol,this.nextPosRow]
        if(this.nextPositionType === 'rat'){
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
        const pix = pixel.pixelsArray[col][row]
        console.log('draw snake : ')
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
            case 'up':
                return [0, -1];
 
            case 'down':
                return [0, +1];
 
            case 'right':
                return [+1, 0];
 
            case 'left':
                return [-1, 0];
        }
    },

    // EVENTS LISTENERS / HANDLERS
    listenKeyboard(){
        document.addEventListener('keydown', snake.handleKeyboard)
    },
    handleKeyboard(event){
        console.log(event.code)
        if(event.code.substring(0,5)=== 'Arrow'){
            event.preventDefault()
            const direction = event.code.split('Arrow')
            snake.direction = direction[1].toLowerCase()
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


  
  
 