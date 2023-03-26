const snake = {
    /* game */
    mode: 'borderless',
    iamAlive: true,
    defaultSnakeSize: 5,
    difficulty: [1,2,3],
    delay: 125, 
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
    resetRequired: false,
    intervalId: 0 ,

    reset(){
        
        snake.resetRequired = true;
        //grid.init();
        app.resetEmojiWin();
        snake.snakeBody = []
        snake.posHead=[0,0],
        snake.snakeTailPos= [0,0],
        document.querySelectorAll('.pixel').forEach(function(elt)
        {                                                                   
            elt.classList.remove('pixel--hide', 'pixel--snakeMode', 'pixel--snake')   
        })
        clearInterval(snake.intervalId)
        document.removeEventListener('keydown', snake.handleKeyboard)
        document.removeEventListener('touchstart', snake.handleTouchStart, false);
        document.removeEventListener('touchmove', snake.handleTouchMove, false);
        console.log('Reset Snake done') // debug
    },

    init(){
        this.direction = 'left' 
        this.iamAlive = true
        this.resetRequired = false;
        this.snakeSize = this.defaultSnakeSize
        app.initEmojiWin();
        this.listenKeyboard()
        let col = Math.round(grid.col/2) 
        let row = Math.floor(grid.row/2) 
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
        // Lancement du jeu
        snake.intervalId = setInterval(snake.play, snake.delay)
    },
    play(){   
        snake.moveSnake()
        if(!snake.iamAlive || snake.resetRequired){
            clearInterval(snake.intervalId)
            if(!snake.iamAlive){
                alert('you lose')
            }
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
                pixIs = 'wall'
                if(snake.mode === 'borderless'){
                    this.goThroughWall()
                }else {
                    this.iamAlive = false
                    this.iDied = true
                }
            }
        }
    },
    goThroughWall(){
        if(this.direction === 'up' || this.direction === 'down'){
            if (this.nextPosRow < 0){
                this.nextPosRow = grid.row -1
            }else {this.nextPosRow = 0}
        }else{
            if (this.nextPosCol < 0){
                this.nextPosCol = grid.col -1 
            }else {this.nextPosCol= 0}
        }
        snake.nextPosition = pixel.pixelsArray[this.nextPosCol][this.nextPosRow]
        snake.nextPositionType = this.whatIsThisPix(snake.nextPosition)
    },
    moveSnake(){  
        this.setNextPosition()
        if (this.nextPositionType === 'snake') {
                // Le serpent ne peut pas reculer
                if(this.snakeBody[1] === this.nextPosition){ 
                    // on annule la dernière direction  
                    snake.direction = snake.lastDirection
                    // on rapelle directement moveSnake pour court-circuiter le setIntervall
                    // et éviter d'avoir un double délai à cause du return
                    this.moveSnake(snake.direction)
                    return;
                } else{
                    // Le serpent se mord la queue et meurt
                    snake.iamAlive = false
                    this.iDied = true;
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
                snake.iamAlive = false
                this.iDied = true
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
        pix.classList.remove(pixel.defaultPixelDrawColor,this.ratColor )
        // pix.classList.remove(this.ratColor)
        pix.classList.add(this.snakeColor, 'pixel--snake')
        this.snakeBody.unshift(pix)        
    },
    eraseSnake(pix){//col,row){
        // const pix = pixel.pixelsArray[col][row]
        pix.classList.remove(this.snakeColor,'pixel--snake' )
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
            col = grid.randomNum(grid.col)
            row = grid.randomNum(grid.row) 
            this.ratPos = [col,row]
            ratPix = pixel.pixelsArray[col][row]
         } while(this.whatIsThisPix(ratPix) != 'free')

        ratPix.classList.remove(pixel.defaultPixelDrawColor)
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
        // swipe
        document.addEventListener('touchstart', snake.handleTouchStart, false);
        document.addEventListener('touchmove', snake.handleTouchMove, false);
    },
    handleTouchStart(event) {
        // Enregistre la position de départ du swipe
        snake.touchStartX = event.touches[0].clientX;
        snake.touchStartY = event.touches[0].clientY;
        
    },
    handleTouchMove(event) {
        if (event.touches.length > 1) {
            // Ignore les gestes multi-touch
            return;
        }

        // Limitations
        const now = Date.now();
        if (now - snake.lastMoveTime < 200) {
            // Limite la fréquence des mouvements à 5 par seconde
            return;
        }
        snake.lastMoveTime = now;

        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;
    
        const deltaX = touchEndX - snake.touchStartX;
        const deltaY = touchEndY - snake.touchStartY;
        snake.arrowKeyPressed = true
        // Détermine la direction du swipe en fonction du mouvement le plus important
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            
            if (deltaX > 0) {
                // Swipe à droite
                snake.direction = 'right';
                
            } else {
                // Swipe à gauche
                snake.direction = 'left';
                
            }
        } else {
            if (deltaY > 0) {
                // Swipe vers le bas
                snake.direction = 'down';
                
            }else {
                // swipe up
                snake.direction = 'up';
                
              }
        }
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


  
  
 