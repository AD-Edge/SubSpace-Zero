//JS13K Game (title TBD) //
//By Alex Delderfield    //
//          2021         //

////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, Button, Sprite, initPointer, track, bindKeys, Text } = kontra;

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
var gridX = 16;
var gridY = 16;
//size of sprite
var isoX = 16; //18
var isoY = 9; //9 

let isoArea = null;
let screenArea = null;
let sideUIL = null;
let sideUIR = null;
let sideUIB = null;

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

    sideUIR = Sprite({
        type: 'obj',
        x: canvas.width - canvas.width/5,
        color: 'grey',
        width: canvas.width/5,
        height: canvas.height,
    });
    sideUIL = Sprite({
        type: 'obj',
        x: 0,
        color: 'grey',
        width: canvas.width/5,
        height: canvas.height,
    });
    sideUIB = Sprite({ 
        type: 'obj',
        x: 0,
        y: canvas.height - canvas.height/10,
        color: '#333333',
        width: canvas.width,
        height: canvas.height/10,
    });
    
    let textW = Text({
        text: 'UI Temp',
        font: '16px Arial bold',
        color: 'black',
        x: 60,
        y: 20,
        anchor: {x: 0.5, y:0.5},
        textAlign: 'center'
    });
    sideUIL.addChild(textW);
    
    BuildIsoGrid();

    InitCreateChunk();
         
    //9,7
    var pos = ConvertISOToScreenPos(isoArea, 6, 6);
    GenerateBuildings(pos[0], pos[1]);
    //10,7
    pos = ConvertISOToScreenPos(isoArea, 7, 6);
    GenerateBuildings(pos[0], pos[1]);
    //9,8
    pos = ConvertISOToScreenPos(isoArea, 6, 7);
    GenerateBuildings(pos[0], pos[1]);
    //10,8
    pos = ConvertISOToScreenPos(isoArea, 7, 7);
    GenerateBuildings(pos[0], pos[1]);

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
    screenArea = Sprite({ 
        x:0,
        y:0,
        width:canvas.width,
        height:canvas.height,
        color: '#FF3333',

    });

    isoArea = Sprite({ 
        x:150,
        y:10,
        width:gridX*(isoX*2),
        height:gridY*(isoY*2),
        //color: '#333333',

    });
    let offS = 0;
    
    //init iso grid
    for (let i=0; i<gridY; i++) {
        for (let j=0; j<gridX; j++) {

            let pos = ConvertISOToScreenPos(isoArea, i, j);
            CreateIsoElement(pos[0], pos[1]);
            //console.log(pos[0]);

            //CreateIsoElement((j+offS)*isoX,(i)*isoY);
            //CreateIsoElement((i*(gDimX) + (offS*gridX) ), j*gDimY-(offS*gridY/2));
            //CreateIsoElement(i*gDimX, j*gDimY);
            //console.log('Created iso tile at [' + pos[0] + ', ' + pos[1] +']');
        }
        //toggle offset
        if(offS == 0) {
            offS = 0.5;
        } else if (offS == 0.5) {
            offS = 0;
        }
    }
}

//Takes in Area for location 0,0 & local isometric point
//Finds GLOBAL (screen) location of points xC/yC
function ConvertISOToScreenPos(area, xL, yL) {

    //calculate x offset into isometric
    var xGlb = area.x + (xL-yL) * isoX;
    //calculate y offset into isometric
    var yGlb = area.y + (xL+yL) * isoY;
    
    return [xGlb, yGlb];

}

//Takes in area for location 0,0 and global point
//Finds LOCAL (isometric) location of point
function ConvertScreenToISOPos(area, GlX, GlY) {

    //calculate x
    var xISO = ((GlY / area.y) / isoY + (GlX - area.x) / isoX) / 2;
    //calculate y
    var yISO = ((GlY / area.y) / isoY - (GlX - area.x) / isoX) / 2;
    
    return [xISO, yISO];

}

function CreateIsoElement(xIn, yIn) {
    const isoSQR = Sprite({
        x:xIn,
        y:yIn,
        width:0,
        image:grndImg1,

        onDown() {
            this.image = grndImg2;
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

//Handle mouse movement
canvas.addEventListener('mousemove', event =>
{
    let bound = canvas.getBoundingClientRect();

    let xM = event.clientX - bound.left - canvas.clientLeft;
    let yM = event.clientY - bound.top - canvas.clientTop;

    //context.fillRect(xM, yM, 16, 16);
    
    //let pos = ConvertISOToScreenPos(screenArea, xM, yM);

    var xTest = parseInt(xM/(isoX/16));
    var yTest = parseInt(yM/(isoY/9));

    isoSpt.x = xM;
    isoSpt.y = yM;

    console.log(xTest + ", " + yTest);
});

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

        sideUIL.render();
        sideUIR.render();
        sideUIB.render();

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