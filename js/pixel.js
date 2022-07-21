const pixel = {
    defaultPixelSize: '30px',
    pixelSize: '0px',
    defaultPixelDrawColor: 'lightgrey',
    pixelDrawColor: 'lightgrey',
    pixelsArray: [],
    
    init() {
        if (this.pixelSize == '0px' || this.pixelSize == 'px') {
            this.pixelSize = this.defaultPixelSize
        }
        document.getElementById('grid').style.pointerEvents = 'auto' ;
    },
    initPixelsArray() {
        this.pixelsArray = []
        for (let i = 0; i < grid.col; i++) {
            this.pixelsArray[i] = [''];
            for (let j = 0; j < grid.row; j++) {
                this.pixelsArray[i][j] = ''
            }
        } 
    },
    drawPixel() {
        const pixelDiv = document.createElement('div')
        pixelDiv.classList.add('pixel', this.pixelDrawColor)
        pixelDiv.style.width = this.pixelSize
        pixelDiv.style.height = this.pixelSize
        /* Ajout des évenements sur le pixel*/
        if (app.currentMode === 'invaders') {
            pixelDiv.addEventListener('click', pixel.handlePixelClick)
        }
        if (app.currentMode === 'mineSweeper') {
            pixelDiv.addEventListener('click', pixel.handlePixelClickMS)
            pixelDiv.addEventListener('contextmenu', pixel.handlePixelRightClickMS)
            pixelDiv.classList.add('pixel--mineSweeper')
            pixelDiv.style.fontSize = this.pixelSize
        }
        if(app.currentMode === 'snake'){
           pixelDiv.classList.add('pixel--snakeMode') 
        }
        if(app.currentMode === '2048'){
            pixelDiv.classList.add('pixel--2048') 
         }
         if(app.currentMode === 'tetris'){
            pixelDiv.classList.add('pixel--tetris') 
            pixelDiv.setAttribute('isFree', 'true')

         }
        return pixelDiv;
    },
    // Gestion clique droit pixel demineur
    handlePixelRightClickMS(event) {
        event.preventDefault();
        // Si la case est un drapeau, on enlève juste le drapeau au clique
        // et remplace par un "?""
        if(event.target.classList.contains('pixel--flag')){
            event.target.classList.replace('pixel--flag', 'pixel--questionMark')
        }else{
            if(event.target.classList.contains('pixel--questionMark')){
                event.target.classList.remove('pixel--questionMark')
            } else{
                event.target.classList.add('pixel--flag')
            }
        }
    },
    // Gestion click pixel pour le démineur
    handlePixelClickMS(event) {
        if(event.target.classList.contains('pixel--flag')||event.target.classList.contains('pixel--questionMark' )){
            // Si Flag ou ? , ne rien faire au clique gauche
        }else{
        mineSweeper.setRevealStyle(event.target)
        if (event.target.textContent == '*') {
            console.log("YOU LOSE :(")
            document.getElementById('grid').style.pointerEvents = 'none' ;
            event.target.classList.add('red');
            document.querySelectorAll('.pixel--bomb').forEach(function(elt)
            {
                elt.classList.remove('pixel--hide', 'lightgrey')
                elt.classList.add('pixel--revealed')
            }) 
            document.getElementById("emojiWin").classList.add('angry')
        }
        if (event.target.textContent == '') {
            const indexIJ = mineSweeper.getPixelIndex(event)
            mineSweeper.initCheckArray();
            mineSweeper.revealAround(indexIJ);
        }
        if(mineSweeper.revealed == grid.size - mineSweeper.nbOfMines ){
            console.log("YOU WIN !!!!")
            document.getElementById('grid').style.pointerEvents = 'none' ;
            document.getElementById("emojiWin").classList.add('happy')

        }
        }
    },
    handlePixelClick(event) {
        // Suppression de l'ancience couleur
        event.target.classList.remove(event.target.classList[1])
        // Récupération et application de la couleur de dessin choisie
        const activeColor = document.querySelector('.colorBtn--active')
        invaders.colorList.forEach(color => {
            if(activeColor.classList.contains(color)){
                pixel.pixelDrawColor = color;
                event.target.classList.add(pixel.pixelDrawColor) ;
            }
        });
        
    },

    setPixelColor(event) {
        pixel.pixelDrawColor = event.target.classList[1];
    },
}