
const invaders = {
    colorList: 
       ['lightgrey',
        'darkgrey',
        'orange',
        'green',
        'red'],

    colorPalette:'',

    init(){
        app.currentMode = 'invaders'
        this.showColorPalette();
        this.listenInvaders();
        document.querySelector('.config').classList.remove('hide')
        document.getElementById('clearBtn').classList.remove('hide')
        console.log('Init Invaders done') // debug
        let sbrick = [[0,1],[1,1],[1,0],]
        let reversesBrick = [[0,1],[1,1],[1,0],]

        let brick = [[1,1],[1,0],[1,0],]
        let reverseBrick = [[1,1],[1,0],[1,0],]
        let reverseBrickagain = [[1,1],[1,0],[1,0],]
            
        // reverseBrickagain.reverse(g2048.transpose(reverseBrickagain.reverse())).reverse() // anti*1 horraire*3
        reverseBrick = g2048.transpose(brick)
        reverseBrickagain = g2048.transpose(g2048.transpose(reverseBrickagain))

        // reverseBrickagain = g2048.transpose(reverseBrickagain.reverse()).reverse()  
        // reverseBrick = g2048.transpose(g2048.transpose(reverseBrick).reverse()) // mirroir renversé  
        // reverseBrick = g2048.transpose(g2048.transpose(reverseBrick)).reverse() // mirroir renversé  
        // reverseBrick.reverse() // piece mirroire
        // reverseBrick =  g2048.transpose(reverseBrick) // piece mirroire diffrente position
        for (let col = 0; col < brick.length; col++) {
            for (let row = 0; row < brick.length; row++) {
                if(brick[col][row]){
                    pixel.pixelsArray[col][row].classList.add('red')
                }
                console.log(col + ' ' + row )
                console.log(reverseBrick)
                if(reverseBrick[row][col]){
                    pixel.pixelsArray[row][col +3].classList.add('red') 
                }

                if(reverseBrickagain[col][row]){
                    pixel.pixelsArray[col+6][row +6].classList.add('red')    
                }

            }
        }
    },
    resetInvaders(){
        /* app.bottomMenu.removeChild(this.colorPalette)*/
        this.colorPalette.classList.add('hide')
        document.querySelector('.config').classList.add('hide')
        document.getElementById('clearBtn').classList.add('hide');
        pixel.pixelDrawColor = pixel.defaultPixelDrawColor
        app.previousMode = 'invaders'
        console.log('Reset Invaders done') // debug
    },
    showColorPalette(){
        this.colorPalette.classList.remove('hide')
    },
    initColorPalette(){
        this.colorPalette = document.createElement('div')
        this.colorPalette.classList.add('colorPalette')
        app.bottomMenu.appendChild(this.colorPalette)

        this.colorList.forEach(color => {
            const colorBtn = document.createElement('div')
            colorBtn.classList.add('colorBtn', color)
            this.colorPalette.appendChild(colorBtn)
        });
        this.colorPalette.lastChild.classList.add('colorBtn--active')
        console.log('Init Color Palette done') // debug
    },
    listenInvaders(){
        this.listenColorPalette();
        this.listenClear();
        this.listenForm();
    },
    listenClear(){
        //btn clear
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.addEventListener('click', function(){
            const saveColor = pixel.pixelDrawColor
            pixel.pixelDrawColor = 'lightgrey'
            grid.drawGrid();
            pixel.pixelDrawColor = saveColor
        }); 
        // clearBtn.addEventListener('click', grid.drawGrid);
    },
    listenForm(){
        // btn valid tailles pixels et grille
        const configBtn = document.getElementById('configBtn');
        configBtn.addEventListener('click', app.configClick);
    },
                
    listenColorPalette(){
        // btn choix couleur
        const colorBtn = document.querySelectorAll('.colorBtn');
        colorBtn.forEach(element => {
            element.addEventListener('click', pixel.setPixelColor)
            element.addEventListener('click', this.setActiveColor)
        });
    },
    setActiveColor(event){
        Array.from(document.querySelectorAll('.colorBtn--active')).forEach((el) => el.classList.remove('colorBtn--active'))
        event.target.classList.add('colorBtn--active')
    },

}