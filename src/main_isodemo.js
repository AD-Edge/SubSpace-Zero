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
var psX=236;
var psY=199;

var isoSpt = null;
var spX = 299;
var spY = 187;

//Array for blocks
var blocks = [];
var blocksB = [];

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
let isoHLT = null;
let screenArea = null;
let sideUIL = null;
let sideUIR = null;
let sideUIB = null;

var blockCells = [];
var blockTest = null;

//Images and sprites
const sparkImg = new Image(); 
sparkImg.src = 'res/sprk.png';
const mechImg = new Image(); 
mechImg.src = 'res/mech_sprite4.png';
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
        image:mechImg,
        dx: mvX,
        dy: mvY,
    });
    //init debug locator
    isoSpt = Sprite({ 
        x:0,
        y:0,
        width:4,
        height:4,
        color: 'white',

        update() {

        }
    });

    //cursor location    
    isoHLT = Sprite({
        x:0,
        y:0,
        image:grndImg2,
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

    //InitCreateChunk();
         
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

    //generate falling stars
    for (let i=0; i < 8; i++) {
        createFallBlock(blocks, 4, 2);
        //0.05 for subspace, 2 for normal space ? 
    }
    //generate falling stars below
    for (let i=0; i < 10; i++) {
        createFallBlock(blocksB, 2, 0.2);
    }

    stateInit = true;
    
}
//Create falling particles
function createFallBlock(array, d, s) {

    let rY = Math.random() * 1 + s; 

    const block = Sprite({
        type: 'block',
        x: Math.floor(Math.random() * (-canvas.width - canvas.width)) + canvas.width,
        y: Math.floor(Math.random()* canvas.width) + 1,
        color: 'white',
        width: d,
        height: d,
        dy: rY/1.75,
        dx: rY,
    });
    array.push(block);
    //console.log(block); 
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
    var xLoc = ((GlY - area.y) / isoY + (GlX - area.x) / isoX) / 2;
    //calculate y
    var yLoc = ((GlY - area.y) / isoY - (GlX - area.x) / isoX) / 2;
    
    return [xLoc, yLoc];

}
function CreateIsoElement(xIn, yIn) {
    const isoSQR = Sprite({
        x:xIn,
        y:yIn,
        width:0,
        image:grndImg1,

    });

    track(isoSQR);
    isoCells.push(isoSQR);
    isoArea.addChild(isoSQR);
}
let ix = 0;
let jy = 0;
let timer = 0;
//let rdCTX = renderIMG.getContext('2d');

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
            //event.clientX : horizontal coord (according to the client area) - ie within the viewport where the event occured (in this case a canvas)
            //bound.left : upper left corner offset to the left of the offsetParent node 
            // canvas.clientLeft : width of the left border of pixels 
            //basically should be pos relative to 0,0 of the canvas (top left)
    let xM = event.clientX - bound.left - canvas.clientLeft;
    let yM = event.clientY - bound.top - canvas.clientTop;

    //console.count(xM + ", " + yM);
    let pos = ConvertScreenToISOPos(isoArea, xM, yM);
    var xtest = Math.ceil(pos[0]- 0.5);
    var ytest = Math.round(pos[1]);

    //console.log('Grid location: ' + xtest + ', ' + ytest);

    if(xtest <= 6) {
        xtest = 6;
    } else if (xtest >= 21) {
        xtest = 21;
    }
    if(ytest <= -4) {
        ytest = -4;
    } else if (ytest >= 11) {
        ytest = 11;
    }

    let cursPos = ConvertISOToScreenPos(isoArea, xtest, ytest-0.25);

    isoHLT.x = cursPos[0]-14;
    isoHLT.y = cursPos[1]-6;
    isoSpt.x = cursPos[0];
    isoSpt.y = cursPos[1];

});
function GameUpdate() {

    if(isoSpt) {
        isoSpt.update();

    }

    //Star Blocks
    blocks.map(block => {
        block.update();
        if(block.y > canvas.height || block.x > canvas.width) {
            block.y = -block.height;
            block.x = Math.floor(Math.random() * (-canvas.width - canvas.width)) + canvas.width;
            //console.log("new coords: " + block.x + ", " + block.y);
        }
    });
    blocksB.map(block => {
        block.update();
        if(block.y > canvas.height || block.x > canvas.width) {
            block.y = -block.height/2;
            block.x = Math.floor(Math.random() * (-canvas.width - canvas.width)) + canvas.width;
        }
    });
    //shake
    // if(plSpark) {
    //     plSpark.update();
    //     var num = Math.floor(Math.random() * 3) - 1;
    //     plSpark.x += num/10;
    //     num = Math.floor(Math.random() * 3) - 1;
    //     plSpark.y += num/10;
    //     //console.log('position debug: [' + plSpark.x + ', ' + plSpark.y + ']');
    // }
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

            //highlight through all cell grids 
            // if(num < isoCells.length-1) {
            //     num += 1;
            //     isoCells[num].image = grndImg2;
            //     if(num == 0) {
            //         //isoCells[isoCells.length-1].image = grndImg1;
            //     } else {
            //         isoCells[num-1].image = grndImg1;
            //     }

            // } else {
            //     isoCells[isoCells.length-1].image = grndImg1;
            //     num = 0;
            // }

            GameUpdate();
            //RunTestChunk();

        }else if (gameState == 1) { //Tutorial
        }else if (gameState == 2) {
        }else if (gameState == 3) {
        }
        
    },
    render: () => {
        blocksB.map(block => block.render());

        if(isoSpt) {
            isoSpt.render();
        }
        if(isoHLT) {
            isoHLT.render();
        }

        if(isoArea) {
            isoArea.render();

        }

        if(plSpark) {
            plSpark.render();
        }

        blocks.map(block => block.render());

        // sideUIL.render();
        // sideUIR.render();
        // sideUIB.render();

        //screenArea.render();

    }
});

loop.start();





/////////////////////////////////////////////////////
//BUTTONS/INPUT
////////////////////////////////////////////////////
bindKeys(['left', 'a'], function(e) {
    if(plSpt_tog) {
        //spX -= isoX;
        //isoSpt.x = spX;
    } else {
        mvX -= 0.1;
        plSpark.dx = mvX;
    }
}, 'keyup');

bindKeys(['right', 'd'], function(e) {
    if(plSpt_tog) {
        //spX += isoX;
        //isoSpt.x = spX;
    } else {
        mvX += 0.1;
        plSpark.dx = mvX;
    }
}, 'keyup');

bindKeys(['up', 'w'], function(e) {
    if(plSpt_tog) {
        //spY -= isoY*2;
        //isoSpt.y = spY;
    } else {
        mvY -= 0.1;
        plSpark.dy = mvY;
    }
}, 'keyup');

bindKeys(['down', 's'], function(e) {
    if(plSpt_tog) {
        //spY += isoY*2;
        //isoSpt.y = spY;
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