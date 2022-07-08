const snake = {
    iamAlive: true,
    defaultSnakeSize: 3,
    snakeSize: 0,
    snakeSpeed: 1,
    snakeColor: 'darkgrey',
    snakeHeadPos: [0,0],
    snakeTailPos: [0,0],
    snakeBody: [],
    difficulty: [1,2,3],
    ratPos: [0,0],
    ratColor: 'red',
    indexPlay: -1,

    init(){
        this.snakeSize = this.defaultSnakeSize
        console.log('Init Snake start') // debug
        //y hauteur
        //x côté
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
                this.snakeHeadPos = [col,row]         
            }
            
            col--
            i++
        }
        this.drawRat();
        setTimeout(this.play, 100)
        // snake.play();
        console.log('Init Snake done') // debug
    },
    reset(){
        console.log('Reset Snake done') // debug
    },
    
    play(){
        snake.indexPlay++
        
        if(snake.iamAlive){
            let direction = snake.getDirection();
            snake.iamAlive = snake.moveSnake(direction[snake.indexPlay])
            setTimeout(snake.play, 100)           
        }else{
            alert('you lose')
        }
    },
    moveSnake(direction){ // async 
        // await sleep(20);
        console.log('move snake ' + direction   )
        let translatedDirection = this.translateDirection(direction)
        // on déplace la tête du serpent
        snakeHead = this.snakeHeadPos
        snakeHead[0] = snakeHead[0] + translatedDirection[0]
        snakeHead[1] = snakeHead[1] + translatedDirection[1]
        console.log(snakeHead)
        // analyse de la prochaine position de la tête
        const pix = pixel.pixelsArray[snakeHead[0]][snakeHead[1]]
        // Si on va dans le mur ou dans le serpent, on perd
        pixIs = this.whatIsThisPix(pix)
        if(pixIs === 'snake'){
            console.log('dans le snake')
            return false;
        }
        if(pixIs === 'wall'){
            console.log('dans le mur')
            return false;
        }
        // Dessine la nouvelle position 
        this.drawSnake(snakeHead[0],snakeHead[1])
        this.snakeHeadPos = snakeHead

        // On supprime le bout de la queue du serpent
        console.log(this.snakeBody.length)
        this.eraseSnake(this.snakeBody.pop())
        return true;
    },
  
    drawSnake(col,row){
        console.log('draw snake')
        const pix = pixel.pixelsArray[col][row]
        pix.classList.remove(pixel.defaultPixelDrawColor)
        pix.classList.add(this.snakeColor)
        this.snakeBody.unshift(pix)
    },
    eraseSnake(pix){//col,row){
        // const pix = pixel.pixelsArray[col][row]
        pix.classList.remove(this.snakeColor)
        pix.classList.add(pixel.defaultPixelDrawColor)
    },
    getDirection(){
         // return ['left', 'up', 'right', 'down']
         // return ['left', 'up', 'right', 'up', 'left', 'left', 'left', 'down']
         const areturn = ['left', 'left', 'left', 'up', 'up', 'right', 'right', 'right', 'right','right', 'right', 'down','down','down','down']
         if (snake.indexPlay > areturn.length -1){
            snake.indexPlay = 0
         }     
         return areturn 
         
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

            default:
                break;
        }
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
            // Debug
            if( i > 1000) {
                console.log('infinite while in snake.drawRat')
                break;
            }
            // Debug
         } while(this.whatIsThisPix(ratPix) != 'free')

        ratPix.classList.remove(ratPix.classList[1])
        ratPix.classList.add(this.ratColor)
    },
}


  
  
 