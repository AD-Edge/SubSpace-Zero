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

    InitCreateChunk();
         
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

//takes in X/Y of Area
//finds relative isometric location of points xC/yC
function ConvertScreenPosToISO(xA, yA, xC, yC) {
    



}

function CreateIsoElement(xIn, yIn) {
    const isoSQR = Sprite({
        x:xIn,
        y:yIn,
        width:0,
        image:grndImg1,

        onDown() {
            this.image = grndImg2;
            
            console.log('width: ' + this.width);
        },
        onUp() {
            if(this.width == 0) {
                this.width = 1;
            } else {
                this.width = 0;
            }
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

let ix = 0;
let jy = 0;
let timer = 0;
let rdCTX = renderIMG.getContext('2d');

function RunTestChunk() {


    //if init, generate roads
    //min-max of roads connecting to other chunks? experiment with values

    //generate locations of building blocks along side roads

    //generate sub blocks, along side building, locate away from roads


    if(timer <= 0) {
        if(ix < chkX) {

            //could loop draw a whole line here 

            rdCTX.fillRect( ix, jy, 1, 1 );
            timer = 0
            ix++;
        } else { //reset 
            jy += 1;
            ix = 0;
        }
    } else {
        timer -= 0.1;
    }
}

function InitCreateChunk() {
    //create image
    renderIMG.width = 32;
    renderIMG.height = 32;

    //rdCTX.drawImage(blkImg, 0, 0);

    // var data = rdCTX.getImageData(0,0,32,32).data;
    // console.log("pixel data out: " + data[0]);

    //draw pixel
    rdCTX.fillStyle = "rgba("+255+","+255+","+255+","+(255/255)+")";
    // rdCTX.fillRect( 0, 0, 1, 1 );
    // rdCTX.fillRect( 1, 0, 1, 1 );
    // rdCTX.fillRect( 2, 0, 1, 1 );
    // rdCTX.fillRect( 3, 0, 1, 1 );
    // rdCTX.fillRect( 28, 0, 1, 1 );
    // rdCTX.fillRect( 29, 0, 1, 1 );
    // rdCTX.fillRect( 30, 0, 1, 1 );
    // rdCTX.fillRect( 31, 0, 1, 1 );

    var data = rdCTX.getImageData(0,0,32,32).data;
    // for(let i=0; i < 10; i++) {
    //     console.log("pixel data out: " + data[i]);
    // }


    for(let i=0; i < chkX; i++) {
        for(let j=0; j < chkX; j++) {
            //console.log("pixel data out: " + data[i]);
        }    

    }


    //generate pixel data

    //as its iterating, add objects to render objects 

    //need some kind of 2nd array for game objects, render both at once for ordering?

}

//lets you export the image to a renderIMG & save
function AddImageSaver() {
    renderIMG.width = 256;
    renderIMG.height = 128;

    //var button = document.getElementById('btn-download');
    // button.addEventListener('click', function (e) {
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

            RunTestChunk();
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