const mineSweeper = {
    nbOfMines: 10,
    revealed: 0,
    minesArray: [],
    checkArray: [],
    difficulty: '',
    resetCount: 0,

    init(){
        this.revealed = 0;
        this.initDifficultySelect();
        this.listenMinesweeper();
        this.initMinesArray();
        this.initCheckArray();
        pixel.pixelDrawColor = pixel.defaultPixelDrawColor
        // On ne peut pas avoir plus de bombes que de cases de la grille
        if (this.nbOfMines > grid.gridSize * grid.gridSize){
            this.nbOfMines = grid.gridSize * grid.gridSize -1 ;
            console.log('nombre de bombe defini par defaut')
        }
        if(this.nbOfMines ==0){this.nbOfMines =1;}
        this.setMines();
        app.initEmojiWin();
        if(grid.gridSize> 20 ) {
            grid.gridDiv.classList.add("overflowY")
        }else{grid.gridDiv.classList.remove("overflowY")}

    },
    listenMinesweeper(){
        const selDiff = document.getElementById("difficulty-choice")
        selDiff.addEventListener('change', this.handleDifficultySelected)
    },
    handleDifficultySelected(evt){
        mineSweeper.difficulty = evt.target.value
        
        mineSweeper.setDifficulty(mineSweeper.difficulty);
        app.init();
 
    },
    setDifficulty(difficulty){
        if(difficulty == 'easyDiff'){
            document.querySelector('.config').classList.add('hide') 
            document.getElementById("difficulty-choice").selectedIndex = 0;
            mineSweeper.nbOfMines = 10
            grid.gridSize = 9
        }
        if(difficulty == 'mediumDiff'){
            document.querySelector('.config').classList.add('hide')
            document.getElementById("difficulty-choice").selectedIndex = 1;
            mineSweeper.nbOfMines = 40
            grid.gridSize = 16
        }
        if(difficulty == 'hardDiff'){
            document.querySelector('.config').classList.add('hide')
            document.getElementById("difficulty-choice").selectedIndex = 2;
            mineSweeper.nbOfMines = 100
            grid.gridSize = 22
        }
        if(difficulty == 'customDiff'){
            document.querySelector('.config').classList.remove('hide')
            document.getElementById("nbOfMines").classList.remove('hide')
            document.getElementById("difficulty-choice").selectedIndex = 3;
            mineSweeper.nbOfMines = document.getElementById('nbOfMines').value
            console.log(document.getElementById('nbOfMines').value)
        } 
    },
    resetMineSweeper(){
       document.getElementById("difficulty").classList.add('hide')
       document.getElementById("nbOfMines").classList.add('hide')
       app.resetEmojiWin();
       document.querySelectorAll('.pixel').forEach(function(elt)
       {                                                                   
           elt.classList.remove('pixel--hide', 'lightgrey', 'pixel--flag', 'pixel--questionMark')
           // elt.classList.add('pixel--revealed')
       })
       this.resetCount++ // debug
       console.log('Reset MineSweeper done'+ this.resetCount)
    },
    initDifficultySelect(){
        const selDiff = document.getElementById("difficulty-choice").value
        this.difficulty = selDiff
        document.getElementById("difficulty").classList.remove('hide')
        if(this.difficulty == "customDiff") {
            document.getElementById("nbOfMines").classList.remove('hide')
        }
    },
    initMinesArray(){
        this.minesArray= []
        // useless ?
        for (let i = 0; i < grid.gridSize +2; i++) {
            this.minesArray[i] = [''];
            for (let j = 0; j < grid.gridSize+2; j++) {
                this.minesArray[i][j] = ''
            } 
        } 
    },
    initCheckArray() {
        this.checkArray= []
        // useless ?
        for (let i = 0; i < grid.gridSize; i++) {
            this.checkArray[i] = [''];
            for (let j = 0; j < grid.gridSize; j++) {
                this.checkArray[i][j] = ''
            } 
        } 
    },
    setMines(){
        // Generation des bombes
        for (let index = 0; index < this.nbOfMines; index++) {
            let col = 0
            let row = 0
            do{ // Generation d'un double index de tab [col][row]
                col = grid.randomNum()
                row = grid.randomNum()
            }  // Si déjà une bombe ici, on boucle pour re générer un index aleatoire
               // car on ne peut pas avoir 2 bombes sur la même case
            while(this.minesArray[col][row] === 'bomb')

            // On place la bombe sur sa case
            this.minesArray[col][row] = 'bomb';
            pixel.pixelsArray[col][row].classList.add( 'pixel--hide', 'pixel--bomb');
            pixel.pixelsArray[col][row].textContent ='*';
        }
        this.setNbMinesAround();
    },

    setNbMinesAround(){
        // boucle sur le tableau des pixels
        for (let i = 0; i < grid.gridSize; i++) {
            for (let j = 0; j < grid.gridSize; j++) {
                /* Pour chaque case, on regarde les 8 cases alentours
                   et on compte le nombre de bombes */                 
                if (this.minesArray[i][j] === 'bomb'){
                    // Si je suis une bombe, pas la peine de compter
                } else {
                    this.minesArray[i][j] = 0
                         /* 00 equivaut à la position this.minesArray[i][j]
                            -1-1	0-1	    +1-1
                            -1 0	0 0	    +10
                            -1+1    0+1     +1+1  */
                    for(let x = i-1; x < i+2; x++ ) {
                        for(let y = j-1; y < j+2; y++ ) {
                            
                            if(x<0 || y<0 || x> grid.gridSize -1 || y> grid.gridSize -1){
                                // Si x ou j négatif, on est hors du tableau, on ne fait rien
                                // Si x ou j supérieur à la taille d'un côté du
                                // tableau, on est hors du tableau, on ne fait rien
                            } else{
                                if (this.minesArray[x][y] === 'bomb'){
                                    this.minesArray[i][j] ++
                                }
                            }
                        }
                    }
                    pixel.pixelsArray[i][j].textContent = this.minesArray[i][j]
                    pixel.pixelsArray[i][j].classList.add('pixel--hide')
                    if (this.minesArray[i][j] === 0) {
                        pixel.pixelsArray[i][j].textContent = ''
                    }

                }
            }
        }
    },
    getPixelIndex(event){
        // recuperation de l'emplacement du pixel dans le tableau de pixels
        let i = 0
        let j = 0
        for (const col of pixel.pixelsArray) {
            
            j=0
            for(iterator of col){
                if(iterator === event.target){
                    return [i,j];
                }
                j++
            }
            i++
        }   
    },

    revealAround(indexIJ){
        let i = indexIJ[0]
        let j = indexIJ[1]
        this.checkArray[i][j] = 'checked'
        for(let x = i-1; x < i+2; x++ ) {
            for(let y = j-1; y < j+2; y++ ) {
                
                if(x<0 || y<0 || x> grid.gridSize -1 || y> grid.gridSize -1){
                    // Si x ou j négatif ou x,j supérieur à la taille d'un côté du tab =>
                    //  on est hors du tableau, on ne fait rien
                } else{  
                    if (pixel.pixelsArray[x][y].classList.contains('pixel--revealed') // pixel déjà révélé
                    || (this.checkArray[x][y]== 'checked' ) ) { // pixel déjà vérifié 
                        // ce pixel est déjà révélé ou checké, on ne fait rien
                    } else {
                        this.checkArray[x][y] = 'checked';
                        if (this.minesArray[x][y]!='bomb' ){
                            // reveal la case
                            const pix = pixel.pixelsArray[x][y] 
                            this.setRevealStyle(pix)
                        }
                        if (this.minesArray[x][y] === 0 ){
                            // Si encore un pixel avec 0 autour, 
                            // on continue a reveal à partir de la nouvelle case
                            this.revealAround([x,y])
                        }                   
                    }
                }
            }
        }
    },
    setRevealStyle(pix){
        pix.classList.remove('pixel--hide', 'lightgrey', 'pixel--flag', 'pixel--questionMark')
        pix.classList.add('pixel--revealed')
        
        if (pix.textContent == '*') {
            // On révèle toutes les bombes de la grille car partie perdue
            pix.classList.add('red');
            document.querySelectorAll('.pixel--bomb').forEach(function(elt)
            {                                                                   
                elt.classList.remove('pixel--hide', 'lightgrey', 'pixel--flag', 'pixel--questionMark')
                elt.classList.add('pixel--revealed')
            })
        } else{
            mineSweeper.revealed ++;

        }
        if (pix.textContent == '1') {
            pix.classList.add('blue')
        }
        if (pix.textContent == '2') {
            pix.classList.add('greenText')
        }
        if (pix.textContent == '3') {
            pix.classList.add('redText')
        }
        if (pix.textContent == '4') {
            pix.classList.add('cyan')
        }
        if (pix.textContent == '5') {
            pix.classList.add('violet')
        }
        if (pix.textContent == '6') {
            pix.classList.add('orange')
        }
        if (pix.textContent == '7') {
            pix.classList.add('darkRed')
        }
        if (pix.textContent == '8') {
            pix.classList.add('cyan')
        }
    },
}
