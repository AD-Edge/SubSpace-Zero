//  JS13K SUBSPACE ZERO  //
//  By Alex Delderfield  //
//          2021         //

////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, Scene, GameObject, Button, Sprite, initPointer, track, bindKeys, Text } = kontra;

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
var preSetup = false;
var initProcessing = false;

var load = null;
var titleObj = null;
var startObj = null;
var sceneChange = -1;
var timer = 0;

//Player
player = null;
helth = 10;

//iso variables
//number of elements
gridX = 16;
gridY = 16;
//size of sprite
isoX = 16; //18
isoY = 9; //9 

//Scene
scene = null;
chunks = [];
isoCells = [];
chunk0 = null;
isoArea = null;
isoHLT = null;

var cCVS = document.getElementById('compileIMG');

//Array for stars
var blocks = [];
var blocksB = [];

var mX = 10; 
var mZ = 15;
var tX = 0 
var tZ = 0;
var gX = false; 
var gZ = false;

//colour registers
var cR = ["#FFF", "#000", "", "", "", "", ""]

/////////////////////////////////////////////////////
//GAME FUNCTIONS
/////////////////////////////////////////////////////

console.log(Rand(0,12)|0);

//Create star particles
function CreateStarBlock(array, d, s) {

    let rY = Math.random() * 1 + s; 

    const block = Sprite({
        type: 'block',
        x: Math.floor(Math.random() * (canvas.width*2 - 0)) + 0,
        y: Math.floor(Math.random()* canvas.width) + 1,
        color: 'white',
        width: d,
        height: d,
        dy: rY/1.75,
        dx: -rY,
    });
    array.push(block);
    //console.log(block); 
}

function TitleGlitch() {
    x=~~mX;x==x%6&&x&1&&CrT();
    mX <= 0 ? (gX = !gX,
    gX ? (tX = Rand(0,12)|0, mX=Rand(0.3,10))
    :(mX = Rand(5,10), tX=-1, CrT())
    ):(mX -= 0.05);
        
    z=~~mZ;z==z%6&&z&1&&CrT();
    mZ <= 0 ? (gZ = !gZ,
    gZ ? (tZ = Rand(0,12)|0, mZ=Rand(0.3,10))
    :(mZ = Rand(5,10), tZ=-1, CrT())
    ):(mZ -= 0.05);
}
function CrT() {
    titleObj = null;
    InitTitle(tX,tZ);
}

function Loading() {
    load = Text({
        x: 6,
        y:10,
        text: 'Loading...',
        color: '#FFFFFF',
        font: '16px Verdana, bold, sans-serif'
    });
}

function SceneSwitch() {
    stateInit = false;
    
    if(sceneChange == 0) { //PLAY GAME
        gameState = 0; 
    } else if (sceneChange == 1) { 
        gameState = 1; 
    } else if (sceneChange == 2) { 
        gameState = 2;
    } else if (sceneChange == 3) { 
        gameState = 3;
    } else if (sceneChange == 4) {   
        gameState = 0; //quit 
    }        
    //reset trigger
    sceneChange = -1;
}

//Run on game start
function InitStartState() {
    console.log('Init Game State');
    
    InitTitle(-1, -1);
    InitStart();
    MKTxt("13", 414, 300, sm);
    MKTxt("by alex delderfield for js  k", 196, 300, sm);
    //InitTxtObj("numbers   0123456789", 136, 250, sm);

    //generate falling stars
    for (let i=0; i < 8; i++) {
        CreateStarBlock(blocks, 4, 2);
        //0.05 for subspace, 2 for normal space ? 
    }
    //generate falling stars below
    for (let i=0; i < 10; i++) {
        CreateStarBlock(blocksB, 2, 0.2);
    }
}

//setup panel
function InitSetupState() {
    MKSqr(30, 30, canvas.width-60, canvas.height-60, '#444');
    MKBt(500, 250, 95, 32, '#666', 2, "drop")
    MKTxt("setup for subspace drop", 30, 40, sm);
    MKTxt("connection active", 450, 40, sm);
    
    MKTxt("set id", 28, 100, md);
    MKTxt("xxx", 140, 100, md);
    
    MKTxt("set sector", 28, 140, md);
    MKTxt("00", 230, 140, md);
}

function DrawGrid() {
    //create healthbar
    for(var i=0; i<helth; i++) {
        MKGr(45, 610-(i*28), 2, md); //makes skull! 
    }

    chunk0  = Sprite({ 
        x:150,
        y:10,
        width:gridX*(isoX*2),
        height:gridY*(isoY*2),
        //color: '#333333',
        
    });
    addRQBG(isoArea);

    //generate isogrid 
    scene = Scene( {
        id:'game',
        children: [chunk0]
    });

    //scene.lookAt(chunk0); //camera change pos 
    
    BuildIsoGrid();
}

function BuildIsoGrid() {
    
    let offS = 0;
    //init iso grid
    for (let i=0; i<gridY; i++) {
        for (let j=0; j<gridX; j++) {

            let pos = ConvertISOToScreenPos(chunk0, i, j);
            CreateIsoElement(pos[0], pos[1]);
            //console.log(pos[0]);
        }
    }
}

function CreateIsoElement(xIn, yIn) {
    const isoSQR = Sprite({
        x:xIn,
        y:yIn,
        width:0,
        image:smLT[46],
    });

    track(isoSQR);
    isoCells.push(isoSQR);
    chunk0.addChild(isoSQR);
}

//Handle mouse movement
canvas.addEventListener('mousemove', event =>
{
    if(gameState == 2) {
        let bound = canvas.getBoundingClientRect();
        let xM = event.clientX - bound.left - canvas.clientLeft;
        let yM = event.clientY - bound.top - canvas.clientTop;
    
        //console.count(xM + ", " + yM);
        let pos = ConvertScreenToISOPos(chunk0, xM, yM);
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
    
        let cursPos = ConvertISOToScreenPos(chunk0, xtest, ytest-0.25);
    
        isoHLT.x = cursPos[0]-14;
        isoHLT.y = cursPos[1]-6;
        // isoSpt.x = cursPos[0];
        // isoSpt.y = cursPos[1];
    }

});

//game zone
function InitGameState() {
    MKTxt("subspace sector  00", 0, 10, sm);
    MKBt(10, 280, 32, 32, '#666', 69, "q")

    console.log("grid generating");

    //random tests
    MKGr(36, 60, 50, md); //makes skull! 
    //MKGr(47, 60, 100, sm); //make grid 
    
    //cursor location    
    isoHLT = Sprite({
        x:0,
        y:0,
        image:smLT[47],
    });
    addRQSP(isoHLT);
}

/////////////////////////////////////////////////////
//PRIMARY GAME LOOP
/////////////////////////////////////////////////////
const loop = GameLoop({
    update: () => {
        if(sceneChange != -1) {
            if(timer > 0) {
                timer -= 0.1;
            } else {
                console.log("changing state");
                SceneSwitch();
                //clear UI 
                clearRenderQ();
            }
        }

        //Star Blocks
        blocks.map(block => {
            block.update();
            if(block.y > canvas.height || block.x < 0) {
                block.y = -block.height;
                block.x = Math.floor(Math.random() * (canvas.width*2 - 0)) + 0;
                //console.log("new coords: " + block.x + ", " + block.y);
            }
        });
        blocksB.map(block => {
            block.update();
            if(block.y > canvas.height || block.x < 0) {
                block.y = -block.height/2;
                block.x = Math.floor(Math.random() * (canvas.width*2 - 0)) + 0;
            }
        });

        if(gameState == 0) { //Start/Menu
            //kickoff first
            if(!initProcessing && !preSetup) {
                Loading();
                InitPreLoad();
                preSetup = true;
                //calls all process functions for graphics
            }
            if(!initProcessing && preSetup) {
                ProcessLetters();
            }
            //kicked off second, once images are generated
            if(!stateInit && initProcessing) {
                load = null;

                InitStartState();
                stateInit = true;
            }
            //ongoing menu processes
            if(stateInit) {
                TitleGlitch();
            }


        }else if (gameState == 1) { //Setup
            if(!stateInit) {
                console.log("Setup state init");
                InitSetupState();
                stateInit = true;
            }
            
        }else if (gameState == 2) { //Game
            if(!stateInit) {
                console.log("Game state init");
                InitGameState();
                DrawGrid();
                stateInit = true;
            }
        }else if (gameState == 3) { //Death
        }
    },
    render: () => {
        if(gameState == 0) { //Start/Menu
            if(load) {
                load.render();
            }

            blocksB.map(block => block.render());
            
            if(titleObj) {
                titleObj.render();
            }
            if(startObj) {
                startObj.render();
            }
            
            
            blocks.map(block => block.render());
            
        }else if (gameState == 1) { //Setup
            
        }else if (gameState == 2) { //Game
            blocksB.map(block => block.render());
            
            //render backgrounds
            // rQ.bg.forEach(element => {
            //     element.obj.render();
            // });
            //render sprites
            rQ.sp.forEach(element => {
                element.obj.render();
            });
            //render scene ??
            scene.render();

            blocks.map(block => block.render());
        }else if (gameState == 3) { //Death
        }

        //render out each object in the render queue
        rQ.ui.forEach(element => {
            element.obj.render();
        });
        
    }
});

loop.start();



/////////////////////////////////////////////////////
//BUTTONS/INPUT
////////////////////////////////////////////////////
bindKeys(['left', 'a'], function(e) {
    
    
}, 'keyup');

bindKeys(['right', 'd'], function(e) {
    
    
}, 'keyup');

bindKeys(['up', 'w'], function(e) {
    
    
}, 'keyup');

bindKeys(['down', 's'], function(e) {
    
    
}, 'keyup');


/////////////////////////////////////////////////////
//SFX
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//MUSIC
/////////////////////////////////////////////////////