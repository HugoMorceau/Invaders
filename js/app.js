/* eslint-disable no-undef */
/* eslint-disable no-constant-condition */
const app = {
    firsInit: true,
    availablesModes: ['invaders', 'mineSweeper', 'snake', '2048', 'tetris'],
    currentMode: 'tetris',
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
            case 'mineSweeper':
                mineSweeper.init();
                break;
            case  'invaders':
                invaders.init();
                break;
            case  'snake':
                snake.init();
                break;
            case  '2048':
                g2048.init();
                break;
            case 'tetris':
                tetris.init();
                break;
            default:
                invaders.init();
        }

        app.firsInit = false;
    },
    reset(){
        // DEBUG PURPOSE
        this.resetCount++;
        console.log('START RESET APP - COUNT : ' + this.resetCount)
        // DEBUG END
        switch(this.previousMode){
            case 'invaders':
                invaders.resetInvaders();
                break;
            case 'mineSweeper':
                mineSweeper.resetMineSweeper();
                break;
            case 'snake':
                snake.reset();
                break;
            case  '2048':
                g2048.reset();
                break;
            case  'tetris':
                tetris.reset();
                break;
            default: 
                invaders.resetInvaders();
                mineSweeper.resetMineSweeper(); 
                snake.reset();
                g2048.reset();
                tetris.reset();
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
            case  'mineSweeper':
                pixel.pixelSize = '25px'; 
                mineSweeper.difficulty = document.getElementById("difficulty-choice").value
                mineSweeper.setDifficulty(mineSweeper.difficulty);
                break;
            case  '2048':
                grid.row = 4;
                grid.col = 4;
                pixel.pixelSize = '60px';   
                break;
            case  'tetris':
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
     
        if(app.currentMode === "mineSweeper" && mineSweeper.difficulty === 'customDiff'){
            mineSweeper.nbOfMines = document.getElementById('nbOfMines').value
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
