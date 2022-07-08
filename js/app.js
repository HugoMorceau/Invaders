/* eslint-disable no-undef */
/* eslint-disable no-constant-condition */

const app = {
    firsInit: true,
    availablesModes: ['invaders', 'mineSweeper', 'snake'],
    currentMode: 'invaders',
    previousMode: '',
    bottomMenu: document.querySelector('.bottomMenu'),
    topMenu: document.querySelector('.topMenu'),
    init(){
        console.log('****** Debut initialisation APP ******') //debug
        app.reset();
        app.listenEvents();
        pixel.init();
        grid.init();

        switch(this.currentMode){
            case 'mineSweeper':
                mineSweeper.init();
                break;
            case  'invaders':
                invaders.init();
                break;
            default:
                invaders.init();
        }
        app.firsInit = false;
        console.log("Previous = " + app.previousMode + " - Current = " + app.currentMode) //debug
        console.log('****** Fin initialisation APP ******') // debug
    },
    reset(){
        switch(this.previousMode){
            case 'invaders':
                invaders.resetInvaders();
                /*this.previousMode = 'invaders';*/
                break;
            case 'mineSweeper':
                mineSweeper.resetMineSweeper();
                /*this.previousMode = 'mineSweeper';*/ 
                break;
            default:
                 if(app.firsInit == false) {
                    console.log('Reset initial')
                    invaders.resetInvaders();
                 }
                 console.log('Reset initial par defaut : ')
                    mineSweeper.resetMineSweeper(); 
                /*this.previousMode = 'invaders';*/
        }
    },
    initModesMenu(){  
        const navTop = document.getElementById('navTop')
        this.availablesModes.forEach(mode => {
            const modeBtn= document.createElement('button')
            modeBtn.id = mode +'Btn'
            modeBtn.textContent = mode
            modeBtn.classList.add('btn', 'menuBtn')
            this.animateBtn(modeBtn)
            navTop.appendChild(modeBtn)
        }); 
    },
    animateBtn(btn){
        const divSlide = document.createElement('div')
        divSlide.classList.add('slide')
        const span = document.createElement('span')
        span.textContent = btn.textContent
        btn.classList.add('animatedBtn')
        btn.textContent = ''
        btn.appendChild(divSlide)
        btn.appendChild(span)
        console.log("animation du bouton : " + btn)
    },
  
    // Ajout des écouteurs communs à la page
    listenEvents(){

        // A FAIRE :  Automatiser la création des ecouteurs via le tableau des modes
        
        // btn demineur
        const msBtn = document.getElementById('mineSweeperBtn');
        msBtn.addEventListener('click', app.setMode);

        // btn invaders
        const invadersBtn = document.getElementById('invadersBtn');
        invadersBtn.addEventListener('click', app.setMode);

        // btn Snake 
        const snakeBtn = document.getElementById('snakeBtn');
        snakeBtn.addEventListener('click', app.handleSnakeMode) 
            
        //btn win or loose
        const winLoseBtn = document.getElementById('emojiWin')
        winLoseBtn.addEventListener('click', app.setModeBis); // Temporaire => A améliorer directement dans setMode ?

    },
    handleSnakeMode(){
        alert('Dsl en cours de developpement...')
    },
    setMode(evt){
        // Récupération du mode à partir de l'id bouton : modeBtn
        app.previousMode = app.currentMode
        app.currentMode = evt.target.id.substring(0,evt.target.id.length-3);
    /* Debug */
        console.log('click on ' + evt.target + ' son Identifiant Est : ' + evt.target.id)
        console.log('Current mode set to : ' + app.currentMode)
        console.log('Previous mode is: ' + app.previousMode);
    /* end Debug */
        app.init();
    },
    setModeBis(){
        app.previousMode = app.currentMode
        // Récupération du mode à partir de l'id bouton : modeBtn
        app.currentMode = 'mineSweeper';
        console.log('click on emojiWin')
        app.init();
    },

    // Clique sur Validation tailles pixels et grille
    configClick(event) {
        event.preventDefault();
        const pixelSizeInput = document.getElementById('pixelSize').value
        const gridSizeInput = document.getElementById('gridSize').value
        if(app.currentMode === "mineSweeper" && mineSweeper.difficulty === 'customDiff'){
            mineSweeper.nbOfMines = document.getElementById('nbOfMines').value
        }
        if (pixelSizeInput === '', 0 || gridSizeInput === '', 0)  {
            console.log('Les tailles de grille ou pixel vide(s) ou = 0, valeur par default sélectionée');
            app.init();
        } else {
            grid.gridSize = gridSizeInput;
            pixel.pixelSize = pixelSizeInput + 'px';
            app.init();
        }
    },
}
app.initModesMenu();
invaders.initColorPalette();
app.init();

