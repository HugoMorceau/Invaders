const g2048 = {
    alive: true,
    arrowKeyPressed: false,
    stateChanged: true,
    direction: '',
    intervalId: 0,
    delai: 250,
    playCount: 0,
    
    reset(){
        document.removeEventListener('keydown', g2048.handleKeyboard)
    },
    init(){

        // alert('en cours de développement...')
        g2048.listenKeyboard()
        // Génération du premier nombre
        g2048.generateNumber()
        g2048.intervalId = setInterval(g2048.play, g2048.delai)
    },
    generateNumber(){
        const col = grid.randomNum()
        const row = grid.randomNum()
        pixel.pixelsArray[col][row].textContent = '2';
    },
    play(){
        /*
        pixelsArray
        0.0 1.0 2.0 3.0
        0.1 1.2 2.1 3.1
        0.2 1.3 2.2 3.2 
        0.3 1.4 2.3 3.3
        LEFT  = COL 0
        RIGHT = COL 3
        UP    = ROW 0
        Down  = ROW 3 
        */
        if(g2048.alive){
            console.log('g2048.play() count = ' + g2048.playCount++)
            if(g2048.arrowKeyPressed){
                g2048.arrowKeyPressed = false
                // si une touche fléchée a été activée
                let col
                let row
                switch(g2048.direction) {
                    // La position de départ est à l'opposé de la direction
                    case 'left':
                        col = 3
                        row = 0
                        break;
                    case 'right':
                        col = 0
                        row = 0
                        break;
                    case 'up':
                        col = 0
                        row = 3
                        break;
                    case 'down':
                        col = 0
                        row = 0
                        break;
                }

                
                if(g2048.stateChanged){
                    g2048.stateChanged = false
                    g2048.generateNumber()
                }
            }
        } else{ 
            clearInterval(g2048.intervalId)
            alert('you lose')
        }
      
    },
     // EVENTS LISTENERS / HANDLERS
     listenKeyboard(){
        document.addEventListener('keydown', g2048.handleKeyboard)
    },
    handleKeyboard(event){
        console.log(event.code)
        if(event.code.substring(0,5)=== 'Arrow'){
            event.preventDefault()
            g2048.direction = event.code.split('Arrow')  
            g2048.arrowKeyPressed = true          
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