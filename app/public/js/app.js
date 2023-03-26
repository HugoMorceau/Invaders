/* eslint-disable no-undef */
/* eslint-disable no-constant-condition */
const app = {
    firsInit: true,
    availablesModes: ['invaders', 'mines', 'snake', 'even', 'blocks'],
    currentMode: 'blocks',
    previousMode: '',
    bottomMenu: document.querySelector('.bottomMenu'),
    topMenu: document.querySelector('.topMenu'),
    initCount: 0,
    resetCount: 0,
    gameModeSelected: false,
    init(){
        if(app.firsInit){
            app.initModesMenu();
            app.listenForm();
            invaders.initColorPalette();
        }
        // Si le mode n'a pas été init, on l'init
        if(this.gameModeSelected){
            this.gameModeSelected = false
        }else{
            app.setMode();
        }
        app.reset();
        pixel.init();
        grid.init();

        switch(this.currentMode){
            case 'mines':
                mines.init();
                break;
            case  'invaders':
                invaders.init();
                break;
            case  'snake':
                snake.init();
                break;
            case  'even':
                geven.init();
                break;
            case 'blocks':
                blocks.init();
                break;
            default:
                invaders.init();
        }

        app.firsInit = false;
    },
    reset(){
        // A développer => Factorisation du reset global ici
        // ....

        // Resets spécifiques
        switch(this.previousMode){
            case 'invaders':
                invaders.resetInvaders();
                break;
            case 'mines':
                mines.resetmines();
                break;
            case 'snake':
                snake.reset();
                break;
            case  'even':
                geven.reset();
                break;
            case  'blocks':
                blocks.reset();
                break;
            default: 
                invaders.resetInvaders();
                mines.resetmines(); 
                snake.reset();
                geven.reset();
                blocks.reset();
                console.log('Previous mode undefined => reset par defaut')
        }
    },
    initEmojiWin(){
        document.getElementById('emojiWin').classList.remove('hide')
        document.getElementById('emojiWin').classList.remove('angry')
        document.getElementById('emojiWin').classList.remove('happy')
    },
    resetEmojiWin(){
        document.getElementById("emojiWin").classList.add('hide')
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
            modeBtn.addEventListener('click', app.setMode);
        }); 
        // on ajoute le listener sur l'emoji win / loose
        document.getElementById('emojiWin').addEventListener('click', app.setMode);

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
    },

    setMode(evt){
        app.previousMode = app.currentMode
        if(typeof evt != 'undefined'){
            app.currentMode = evt.target.id.substring(0,evt.target.id.length-3);
            console.log('Click on ' + evt.target + ' Target ID is : ' + evt.target.id)      
        } 
        if ( typeof evt === 'undefined' || app.currentMode === 'emoji' ){
            app.currentMode = app.previousMode;
        }
        switch(app.currentMode){
            case  'snake':
                grid.row = 20;
                grid.col = 30;
                pixel.pixelSize = '10px';
                break;
            case  'mines':
                pixel.pixelSize = '25px'; 
                mines.difficulty = document.getElementById("difficulty-choice").value
                mines.setDifficulty(mines.difficulty);
                break;
            case  'even':
                grid.row = 4;
                grid.col = 4;
                pixel.pixelSize = '60px';   
                break;
            case  'blocks':
                grid.row = 22;
                grid.col = 10;
                pixel.pixelSize = '25px';   
                break;
            default:
                grid.row = grid.defaultSize;
                grid.col = grid.defaultSize;
                pixel.pixelSize = pixel.defaultPixelSize
                console.log('mode de jeu par défaut')
        }
        console.log('Current mode set to : ' + app.currentMode)
        console.log('Previous mode is: ' + app.previousMode);
        if(typeof evt === 'undefined') {
            console.log('Mode set from app.ini()')
        }else{
            app.gameModeSelected = true;
            app.init();
        }
        
    },
    listenForm(){
        // btn valid tailles pixels et grille
        const configBtn = document.getElementById('configBtn');
        configBtn.addEventListener('click', app.configClick);
    },
    // Clique sur Validation tailles pixels et grille
    configClick(event) {
        event.preventDefault();
        app.gameModeSelected = true;
        const pixelSizeInput = document.getElementById('pixelSize').value
        const gridColsInput = document.getElementById('gridCols').value
        const gridRowsInput = document.getElementById('gridRows').value
     
        if(app.currentMode === "mines" && mines.difficulty === 'customDiff'){
            mines.nbOfMines = document.getElementById('nbOfMines').value
        }

        if (pixelSizeInput !== '' && pixelSizeInput > 0) {
            pixel.pixelSize = pixelSizeInput + 'px';
        }
        if( gridColsInput !== '' || gridColsInput > 0 ){
            grid.col = gridColsInput
        }
        if(gridRowsInput!== '' || gridRowsInput> 0)  {
            grid.row = gridRowsInput
        } 
        app.init();
    },
    transpose(matrix) {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    },
}
 app.init();

let touchstartX = 0
let touchendX = 0
    
function checkDirection() {
  if (touchendX < touchstartX) alert('swiped left!')
  if (touchendX > touchstartX) alert('swiped right!')
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})
