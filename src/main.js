//JS13K Game (title TBD) //
//By Alex Delderfield    //
//          2021         //


////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, Button, Sprite, initPointer, track } = kontra;

//Get components
const { canvas, context } = init();

initPointer();
kontra.initKeys();

//Primary Game State
//0 = Start screen/zone
//1 = Tutorial area
//2 = Game area
//3 = Death 
var gameState = 0;
var stateInit = false;

var plSpark = null;
var mvX=0;
var mvY=0;
var psX=200;
var psY=200;

var isoCells = [];
var gridX = 9;
var gridY = 11;
var areaX = 16*gridX;
var areaY = 16*gridY;
var gDim = areaX/gridX

//Images and sprites
const sparkImg = new Image(); 
sparkImg.src = 'res/sprk.png';
const grndImg1 = new Image();   //9x11
grndImg1.src = 'res/gnd1.png';
const grndImg2 = new Image(); 
grndImg2.src = 'res/gnd2.png';

/////////////////////////////////////////////////////
//GAME FUNCTIONS
////////////////////////////////////////////////////

function InitGameState() {
    console.log('Init Game State');

    //init player spark
    plSpark = Sprite({ 
        x:psX,
        y:psY,
        image:sparkImg,
        dx: mvX,
        dy: mvY,
    });

    //init iso grid
    for (let i=0; i<gridX; i++) {
        for (let j=0; j<gridY; j++) {
            CreateIsoGrid(i*gDim,j*gDim);
            console.log('Created iso tile at [' + i*gDim + ', ' + j*gDim +']');
        }
    }

}

function CreateIsoGrid(xIn, yIn) {

    const isoSQR = Sprite({
        x:xIn,
        y:yIn,
        image:grndImg1,    
    });

    track(isoSQR);
    isoCells.push(isoSQR);

}

function GameUpdate() {

    if(plSpark) {
        plSpark.update();

        if(kontra.keyPressed('left')) {
            mvX -= 0.01;
            plSpark.dx = mvX;
        }
        if(kontra.keyPressed('right')) {
            mvX += 0.01;
            plSpark.dx = mvX;
        }
        if(kontra.keyPressed('up')) {
            mvY -= 0.01;
            plSpark.dy = mvY;
        }
        if(kontra.keyPressed('down')) {
            mvY += 0.01;
            plSpark.dy = mvY;
        }

        //console.log('position debug: [' + plSpark.x + ', ' + plSpark.y + ']');
    }

}

/////////////////////////////////////////////////////
//PRIMARY GAME LOOP
////////////////////////////////////////////////////
const loop = GameLoop({
    update: () => {

        if(gameState == 0) { //Start
            if(stateInit == false) {
                stateInit = true;
                InitGameState();
            }
            GameUpdate();
        }else if (gameState == 1) { //Tutorial
        }else if (gameState == 2) {
        }else if (gameState == 3) {
        }
        

    },
    render: () => {

        if(plSpark) {
            plSpark.render();
        }


    }
});

loop.start();





/////////////////////////////////////////////////////
//BUTTONS/INPUT
////////////////////////////////////////////////////




/////////////////////////////////////////////////////
//MUSIC/SFX
////////////////////////////////////////////////////