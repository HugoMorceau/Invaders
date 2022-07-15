
const invaders = {
    colorList: 
       ['lightgrey',
        'darkgrey',
        'orange',
        'green',
        'red'],

    colorPalette:'',
    flipMajorDiagonal(matrix) {
        return matrix[0].map((column, index) => (
            matrix.map(row => row[index])
          ))
      },
      
    init(){
        app.currentMode = 'invaders'
        this.showColorPalette();
        this.listenInvaders();
        document.querySelector('.config').classList.remove('hide')
        document.getElementById('clearBtn').classList.remove('hide')
        console.log('Init Invaders done') // debug     
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