//  JS13K SUBSPACE ZERO  //
//  By Alex Delderfield  //
//          2021         //

////////////////////////////////////////////////////
//INITILIZATIONS
////////////////////////////////////////////////////

//Initial import
const { init, GameLoop, Scene, GameObject, Button, 
    Sprite, initPointer, track, bindKeys, Text } = kontra;

//Get components
const { canvas, context } = init();

initPointer();
kontra.initKeys();

//Primary Game State
//0 = Start screen/zone
//1 = Tutorial area
//2 = Game area
//3 = Death 
gameState = 0;
stateInit = false;
preSetup = false;
initProcessing = false;

load = null;
titleObj = null;
conObj = null;
cntObj = null;
startObj = null;
sceneChange = -1;
timer = 0;

//Player
cPlayer = null;
helth = 5;
cPlayerID = null;
players = []; //user data
opponents = []; //opponents to render
pX = -10;
pY = -10;

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

isoHLT = null;

cCVS = document.getElementById('compileIMG');

//Array for stars
blocks = [];
blocksB = [];

mX = 10; 
mZ = 15;
tX = 0 
tZ = 0;
gX = false; 
gZ = false;

//colour registers
cR = ["#FFF", "#000", "", "", "", "", ""]

chunk0  = Sprite({ 
    x:150,
    y:10,
    width:gridX*(isoX*2),
    height:gridY*(isoY*2),
    //color: '#333333',
    
});
cPlayer = Sprite({
    x: pX,
    y: pY,
});
fstTm = 2;

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



    
// if(fstLog) {
//     fstLog = false; 
//     for(let i=0; i < players.length; i++) {
//         if(players[i].id != cPlayerID) {
//             //for all non client players
//             //fake update postions
//             console.log("fake setup");
//             SetOpponentPosition(players[i].id,
//                 players[i].x, players[i].y);
//         }
//     }
// }

function DrawGrid() {
    //create healthbar
    for(var i=0; i<helth; i++) {
        MKGr(45, 610-(i*28), 2, md); //makes skull! 
    }

    if(chunk0 == null) {
        chunk0  = Sprite({ 
            x:150,
            y:10,
            width:gridX*(isoX*2),
            height:gridY*(isoY*2),
            color: '#333333',
            
        });
    }
    //addRQBG(isoArea);

    //generate isogrid 
    scene = Scene( {
        id:'game',
        children: [chunk0]
    });

    //scene.lookAt(chunk0); //camera change pos 
    
    BuildIsoGrid();

    
    cPlayer = Sprite({
        x: pX,
        y: pY,
        //color: 'white',
        image:smLT[50],
    });
    chunk0.addChild(cPlayer);

}

function BuildIsoGrid() {
    let offS = 0;
    //init iso grid
    for (let i=0; i<gridY; i++) {
        for (let j=0; j<gridX; j++) {
            
            let pos = ConvertISOToScreenPos(chunk0, i, j);
            CreateIsoElement(pos[0], pos[1]);
            if(j==0 && i==0) {
                console.log("X, Y: " + pos[0] + ", " + pos[1]);
            }
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
    chunk0.addChild(isoSQR);
}

//Handle mouse movement
canvas.addEventListener('mousemove', event =>
{
    if(gameState == 2) {
        let bound = canvas.getBoundingClientRect();
        let xM = event.clientX - bound.left - canvas.clientLeft;
        let yM = event.clientY - bound.top - canvas.clientTop;
    
        let cursPos = SetToGrid(xM, yM);
        isoHLT.x = cursPos[0]-14;
        isoHLT.y = cursPos[1]-6;
    }

});

//game zone
function InitGameState() {
    MKTxt("subspace sector  00", 4, 30, sm);
    MKBt(10, 280, 32, 32, '#666', 69, "q")

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

function CreateUserObj(xIn, yIn) {
    var p = ConvertISOToScreenPos(chunk0, xIn -0.5, yIn -0.5);
    const userObj = Sprite({
        x: p[0],
        y: p[1],
        //color: 'white',
        image:smLT[51],
    });
    
    chunk0.addChild(userObj);
    opponents.push(userObj);
    //addRQSP(userObj);
    console.log("new player object created, x:" + xIn + ", " + yIn);

}

function RefreshOnConnection() {
    // chunk0 = null;
    // DrawGrid();

    //temp for now, refresh primary players array
    for(let i=0; i < players.length; i++) {
        players[i].isActive = false;
    }
    players.length = 0;
    players = [];

    //rebuild
    RefreshPlayers();
    //BuildPixelGrid();
}
//Functions called by CLIENT 
function SetClientPosition(id, x, y) {
    //init creation
    if(cPlayerID == null) { 
        cPlayerID = id; //set ID
        console.log("Setup Client " + cPlayerID + " at pos: " + x + ", " + y);
        const user = new User(id, x, y, 5);

        cPlayerUsr = user;
        players.push(user);
    } 
    var p = ConvertISOToScreenPos(chunk0, cPlayerUsr.x -0.5, cPlayerUsr.y -0.5);

    if(x<=16) {
        cPlayerUsr.x = x; 
        pX= p[0];

    }
    cPlayerUsr.y = y; 

    pY= p[1];
    console.log("pX, pY: " + pX + ", " + pY);


}

//rebuild player positions
function RefreshPlayers() {
    //clearRenderQSpt();

    //cleanup
    for(let i=0; i < opponents.length; i++) {
        opponents[i].isActive = false;
        chunk0.removeChild(opponents[i]);
    }
    opponents.length = 0;
    opponents = []

    console.log("rebuilding " + players.length + " user objects:");

    //rebuild
    for(let i=0; i < players.length; i++) {
        if(players[i].id != cPlayerID) { //dont build client 
            console.log("listing user obj #" + i + ": " + players[i].id);
            CreateUserObj(players[i].x, players[i].y);            
        }

        // console.log("rebuilding opponent " + players[i].id 
        //     + " @ pos " + players[i].x + ", " + players[i].y);
    }

    
}

//for updating opponent positions
function SetOpponentPosition(id, x, y) {
    
    for(let i=0; i < players.length; i++) {
        if(players[i].id == id) {
            
            //let pos = ConvertISOToScreenPos(chunk0, x, y);
            players[i].x = x;
            players[i].y = y;
            
            console.log("Moving player " + id + " to pos: " + x + ", " + y);
            
            RefreshPlayers()
            return;
        }
    }

    console.log("opponent not found: " + id);
    
}
//Create/Remove opponents
function SetUser(id, val, x, y, rad) {  
    if (val == 0) {
        console.log("Remove opponent: " + id);
        players.splice(players.indexOf(id), 1);
        //console.log("player object deleted");

        RefreshPlayers();
        
    } else if (val == 1) {
        console.log("Adding new opponent: " + id);
        
        const user = new User(id, x, y, rad);
        players.push(user);
        //console.log("new player object created, x:" + x + ", " + y);

        RefreshPlayers();

    } else {
        console.log("ERROR Unknown User Setting Requested??")
    }

    console.log("number of players NOW: " + players.length);
    console.log("number of opponents NOW: " + opponents.length);

}

//Draw Combat Zone around player
function SetCombatZone(id) {

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
                //console.log("changing state");
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
                if(cPlayerID == null) {
                    SetMessage();
                } else {
                    SetMessage("session connected");
                }
                InitStartState();
                stateInit = true;
            }
            //ongoing menu processes
            if(stateInit) {
                TitleGlitch();
            }

        }else if (gameState == 1) { //Setup
            if(!stateInit) {
                //console.log("Setup state init");
                InitSetupState();
                stateInit = true;
            }
            
        }else if (gameState == 2) { //Game
            if(!stateInit) {
                //console.log("Game state init");
                InitGameState();
                DrawGrid();
                stateInit = true;
            }

            if(cPlayer != null) {
                cPlayer.x = pX;
                cPlayer.y = pY;
            }

            if(fstTm >= 0.1) { //hack timer fix 
                fstTm -= 0.1;
            } else if (fstTm >=0 ) {
                    RefreshPlayers();
                    fstTm = -1;
            }

        }else if (gameState == 3) { //Death

        }
    },
    render: () => {
        
        if(conObj)conObj.render();
        if(cntObj)cntObj.render();

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
            
            //opponents.map(userObj => userObj.render());

            //render backgrounds
            // rQ.bg.forEach(element => {
            //     element.obj.render();
            // });
            //render sprites
            rQ.sp.forEach(element => {
                element.obj.render();
            });
            //render scene ??
            //scene.render();

            if(chunk0) {
               chunk0.render(); 
            }


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


/**
 * Client side user class
 */
 class User {
	/**
	 * @param {Socket} socket
	 */
	constructor(id, x, y, rad) {
		this.id = id;
		this.x = x; //grid/local X
        this.y = y; //grid/local Y
        this.combat = false;
        this.attRad = rad;
	}

}

/////////////////////////////////////////////////////
//BUTTONS/INPUT
////////////////////////////////////////////////////
bindKeys(['left', 'a'], function(e) {
    document.getElementById("left").click();
}, 'keyup');

bindKeys(['right', 'd'], function(e) {
    document.getElementById("right").click();
}, 'keyup');

bindKeys(['up', 'w'], function(e) {
    document.getElementById("up").click();
}, 'keyup');

bindKeys(['down', 's'], function(e) {
    document.getElementById("down").click();
}, 'keyup');


/////////////////////////////////////////////////////
//SFX
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
//MUSIC
/////////////////////////////////////////////////////