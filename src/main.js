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

//Player stuff
var plSpark = null;
var mvX=0;
var mvY=0;
var psX=200;
var psY=200;

//Isometric stuff 
var isoCells = [];
//number of elements
var gridX = 16;
var gridY = 32;
//size of sprite
var isoX = 34; //18
var isoY = 8; //9 

var plSpark = null;
var gridSpt = null;
let isoArea = null;

//Images and sprites
const sparkImg = new Image(); 
sparkImg.src = 'res/sprk.png';
const grndImg1 = new Image();   //9x18
grndImg1.src = 'res/gnd1.png';
const grndImg2 = new Image(); 
grndImg2.src = 'res/gnd2.png';
const grndImg2HL = new Image(); 
grndImg2HL.src = 'res/gnd2HL.png';

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

}

function BuildIsoGrid() {
    isoArea = Sprite({ 
        x:40,
        y:40,
        width:gridX*isoX,
        height:gridY*isoY,
        color: '#333333',

    });
    let offS = 0;
    
    //init iso grid
    for (let i=0; i<gridY; i++) {
        for (let j=0; j<gridX; j++) {
            CreateIsoElement((j+offS)*isoX,(i)*isoY);
            //CreateIsoElement((i*(gDimX) + (offS*gridX) ), j*gDimY-(offS*gridY/2));
            //CreateIsoElement(i*gDimX, j*gDimY);
            //console.log('Created iso tile at [' + i*gDimX + ', ' + j*gDimY +']');
        }
        //toggle offset
        if(offS == 0) {
            offS = 0.5;
        } else if (offS == 0.5) {
            offS = 0;
        }
    }
}

function CreateIsoElement(xIn, yIn) {
    const isoSQR = Sprite({
        x:xIn,
        y:yIn,
        image:grndImg1,

        onDown() {
            this.image = grndImg2HL;
        },
        onUp() {
            this.image = grndImg1;
        },
        onOver() {
            this.image = grndImg2;
        },
        onOut: function() {
            this.image = grndImg1;            
        }
    });

    track(isoSQR);
    isoCells.push(isoSQR);
    isoArea.addChild(isoSQR);
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
                InitGameState();
                
                BuildIsoGrid();
                
                stateInit = true;
            }
            GameUpdate();
        }else if (gameState == 1) { //Tutorial
        }else if (gameState == 2) {
        }else if (gameState == 3) {
        }
        

    },
    render: () => {

        if(isoArea) {
            isoArea.render();

        }

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