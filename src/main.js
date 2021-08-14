//JS13K Game (title TBD) //
//By Alex Delderfield    //
//          2021         //


////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, Button, Sprite, initPointer, track, bindKeys } = kontra;

//Get components
const { canvas, context } = init();

const renderIMG = document.getElementById('renderIMG');

initPointer();
kontra.initKeys();

//Primary Game State
//0 = Start screen/zone
//1 = Tutorial area
//2 = Game area
//3 = Death 
var gameState = 0;
var stateInit = false;
var plSpt_tog = true; //false = player

//Player stuff
var plSpark = null;
var mvX=0;
var mvY=0;
var psX=200;
var psY=200;

var isoSpt = null;
var spX = 299;
var spY = 187;


//Isometric stuff 
var isoCells = [];
var chkX = 32;
var chunk0 = new Array(chkX);
//number of elements
var gridX = 8;
var gridY = 32;
//size of sprite
var isoX = 34; //18
var isoY = 8; //9 

let isoArea = null;

var blockCells = [];
var blockTest = null;

//Images and sprites
const sparkImg = new Image(); 
sparkImg.src = 'res/sprk.png';
const grndImg1 = new Image();   //9x18
grndImg1.src = 'res/gnd1.png';
const grndImg2 = new Image(); 
grndImg2.src = 'res/gnd2.png';
const grndImg2HL = new Image(); 
grndImg2HL.src = 'res/gnd2HL.png';
const blkImg = new Image(); 
blkImg.src = 'res/blok1.png';

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
    //init debug locator
    isoSpt = Sprite({ 
        x:spX,
        y:spY,
        width:4,
        height:4,
        color: 'white',

        update() {

        }
    });
    
    BuildIsoGrid();

    CreateChunk();
         
    GenerateBuildings(204, 126);
    GenerateBuildings(221, 134);
    GenerateBuildings(189, 134);
    GenerateBuildings(205, 142);
       
    stateInit = true;
    
}

function GenerateBuildings(bX, bY) {
    blockTest = Sprite({ 
        x:bX,
        y:bY,
        width:4,
        height:4,
        image: blkImg,
    });

    blockCells.push(blockTest);
    isoArea.addChild(blockTest);

}
function BuildIsoGrid() {
    isoArea = Sprite({ 
        x:166,
        y:28,
        width:gridX*isoX,
        height:gridY*isoY,
        //color: '#333333',

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
        width:0,
        image:grndImg1,

        onDown() {
            this.image = grndImg2;
            this.width = 1;
            console.log('width: ' + this.width);
        },
        onUp() {
            this.image = grndImg2HL;
        },
        onOver() {
            if(this.width == 0) {
                this.image = grndImg2;
            }
        },
        onOut: function() {
            if(this.width == 0) {
                this.image = grndImg1;
            }
        }
    });

    track(isoSQR);
    isoCells.push(isoSQR);
    isoArea.addChild(isoSQR);
}

function CreateChunk() {
    //init array
    // for (var i=0; i< chunk0.length; i++) {
    //     chunk0[i] = new Array(chkX);
    // }
    // console.log(chunk0);

    //var dat = blkImg.data;
    //console.log(dat[8]);

    renderIMG.width = 256;
    renderIMG.height = 128;

    renderIMG.addEventListener('contextmenu', function (e) {
        var dataURL = canvas.toDataURL('image/png');
        renderIMG.src = dataURL;
    });

}

function GameUpdate() {

    if(isoSpt) {
        isoSpt.update();

    }


    if(plSpark) {
        plSpark.update();

        var num = Math.floor(Math.random() * 3) - 1;
        plSpark.x += num/10;
        num = Math.floor(Math.random() * 3) - 1;
        plSpark.y += num/10;
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
            }
            GameUpdate();
        }else if (gameState == 1) { //Tutorial
        }else if (gameState == 2) {
        }else if (gameState == 3) {
        }
        

    },
    render: () => {

        if(isoSpt) {
            isoSpt.render();
        }

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
bindKeys(['left', 'a'], function(e) {
    if(plSpt_tog) {
        spX -= isoX;
        isoSpt.x = spX;
    } else {
        mvX -= 0.1;
        plSpark.dx = mvX;
    }
}, 'keyup');

bindKeys(['right', 'd'], function(e) {
    if(plSpt_tog) {
        spX += isoX;
        isoSpt.x = spX;
    } else {
        mvX += 0.1;
        plSpark.dx = mvX;
    }
}, 'keyup');

bindKeys(['up', 'w'], function(e) {
    if(plSpt_tog) {
        spY -= isoY*2;
        isoSpt.y = spY;
    } else {
        mvY -= 0.1;
        plSpark.dy = mvY;
    }
}, 'keyup');

bindKeys(['down', 's'], function(e) {
    if(plSpt_tog) {
        spY += isoY*2;
        isoSpt.y = spY;
    } else {
        mvY += 0.1;
        plSpark.dy = mvY;
    }
}, 'keyup');

//toggle
bindKeys(['t'], function(e) {
    plSpt_tog = !plSpt_tog;
}, 'keyup');

/////////////////////////////////////////////////////
//MUSIC/SFX
////////////////////////////////////////////////////