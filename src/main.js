//  JS13K SUBSPACE ZERO  //
//  By Alex Delderfield  //
//          2021         //

////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, GameObject, Button, Sprite, initPointer, track, bindKeys, Text } = kontra;

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
    x = ~~mX;
    x == 1 ? CrT() :x == 3 ? CrT() :x == 5 ? CrT(): null;
    mX <= 0 ? (gX = !gX,
        gX ? (tX = Math.floor(Rand(0,12)), mX=Rand(0.3,10))
        :(mX = Rand(5,10), tX=-1, CrT())
    ):(mX -= 0.05);

    z = ~~mZ;
    z == 1 ? CrT() :z == 3 ? CrT() :z == 5 ? CrT(): null;
    mZ <= 0 ? (gZ = !gZ,
        gZ ? (tZ = Math.floor(Rand(0,12)), mZ=Rand(0.3,10))
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
    console.log("grid");
}

//game zone
function InitGameState() {
    MKTxt("subspace sector  00", 0, 10, sm);
    MKBt(10, 280, 32, 32, '#666', 69, "q")
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
                clearUI();
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
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//SFX
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//MUSIC
/////////////////////////////////////////////////////