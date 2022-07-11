const g2048 = {
    alive: true,
    arrowKeyPressed: false,
    stateChanged: true,
    direction: '',
    intervalId: 0,
    delai: 250,
    playCount: 0,
    lastMerged: '',

    reset() {
        document.removeEventListener('keydown', g2048.handleKeyboard)
    },
    init() {

        // alert('en cours de développement...')
        g2048.listenKeyboard()
        // Génération du premier nombre
        g2048.generateNumber()
        //g2048.intervalId = setInterval(g2048.play, g2048.delai)
        g2048.play()
    },
    generateNumber() {
        const col = grid.randomNum()
        const row = grid.randomNum()
        // on détermine aléatoirement si il s'agit d'un 2 d'un 4
        // la probabilité d'avoir un 4 est de 10%

        if (Math.floor(Math.random() * (10 - 1)) + 1 === 4) {
            pixel.pixelsArray[col][row].textContent = '4';
        } else { pixel.pixelsArray[col][row].textContent = '2'; }
    },
    play() {

        if (g2048.alive) {
            console.log('g2048.play() count = ' + g2048.playCount++)
            if (g2048.arrowKeyPressed) {
                g2048.arrowKeyPressed = false
                // si une touche fléchée a été activée
                let col
                let row
                switch (g2048.direction) {
                    // La position de départ est à l'opposé de la direction
                    case 'left':
                        // droite gauche haut bas
                        col = 3
                        row = 0
                        break;
                    case 'right':
                        //gauche droite haut bas
                        col = 0
                        row = 0
                        break;
                    case 'up':
                        // gauche droite bas haut
                        col = 0
                        row = 3
                        break;
                    case 'down':
                        // gauche droite haut bas
                        col = 0
                        row = 0
                        break;
                }

                g2048.readGrid()

                if (g2048.stateChanged) {
                    g2048.stateChanged = false
                    g2048.generateNumber()
                }
            }
        } else {
            clearInterval(g2048.intervalId)
            alert('you lose')
        }
    },



    // EVENTS LISTENERS / HANDLERS
    listenKeyboard() {
        document.addEventListener('keydown', g2048.handleKeyboard)
    },
    handleKeyboard(event) {
        console.log(event.code)
        if (event.code.substring(0, 5) === 'Arrow') {
            event.preventDefault()
            g2048.direction = event.code.split('Arrow')[1].toLowerCase()
            //g2048.direction = g2048.direction.toLowerCase()
            g2048.arrowKeyPressed = true
            g2048.play()
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


    readGrid() {
        // analyse et fusion de droite à gauche

        for (let row = 0; row < grid.gridSize; row++) {
            console.log('analyse de la ligne '+ row)
            if (this.direction = 'left') {
                // inversion de la ligne du tableau pour pouvoir la lire toujours dans le même ordre quelque soit la directio demandée
                pixel.pixelsArray[row].reverse();
            }
            for (let col = 0; col < grid.gridSize -1; col++) {
                //pixel de comparaison
                console.log('analyse de la colonne '+ col)
                if (g2048.direction = 'left' || g2048.direction === 'right') {

                    let rowCompare = row
                    let colCompare = col + 1
                    // nom raccourcis
                    let currentPixel = pixel.pixelsArray[col][row]
                    let comparedPixel = pixel.pixelsArray[colCompare][rowCompare]

                    if (currentPixel.textContent != 0) {
                        if(g2048.alreadyMerged && currentPixel != g2048.lastMerged){
                            g2048.alreadyMerged = false
                            g2048.lastMerged = ''
                        }
                        // addittionne les deux cellules identiques
                        if (currentPixel.textContent === comparedPixel.textContent && !g2048.alreadyMerged) {
                            // on double la valeur du pixel
                            pixel.pixelsArray[col][row].textContent += currentPixel.textContent
                            pixel.pixelsArray[colCompare][rowCompare] = 0
                            // un même pixel ne peut fusionner qu'une seule fois par mouvement
                            g2048.alreadyMerged = true 
                            // sauvegarde du pixel
                            currentPixel = pixel.pixelsArray[col][row]
                        }
                        // Check les cellules vides à gauche
                        colCompare = col - 1
                        while (pixel.pixelsArray[colCompare][row].textContent === 0 && colCompare > 0) {
                            let freeCell = true
                            // on déplace le pixel en cours d'analyse jusqu'à la cellule libre la plus à gauche
                            pixel.pixelsArray[colCompare][row].textContent = pixel.pixelsArray[col][row].textContent
                            // refresh sav pixel
                            currentPixel = pixel.pixelsArray[colCompare][row]
                            colCompare--
                        }
                        // sauvegarde du dernier pixel fusionné
                        if(g2048.alreadyMerged){
                            g2048.lastMerged = currentPixel
                        }


                    } else {
                        //free cell = true
                    }
                }

            }
        }
    },

}