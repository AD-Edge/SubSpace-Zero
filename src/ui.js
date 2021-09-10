//User interface setup
var smLT = [];
var mdLT = [];
var lgLT = [];

var sm = 2;
var md = 4;
var lg = 8;

//Setup all generated letters and images
function InitPreUI() {
    ProcessLetters();

    //ProcessGraphics();
}

//Setup UI elements
function InitUI() {
}

//Process Letters and Numbers 
function ProcessLetters() {
    console.log("//Need to load " + tl.length + " sprites//");
    for(var i=0; i< tl.length; i++) {
        //decompile
        DecompileDrawSprite(tl[i], 5, cmpIMG);
        ConvertCanvastoImageData(cmpIMG, false); 
    }
}

function PopulateImageArray(sz) {
    for(var i=0; i< blobArr.length; i++) {
        const newImg = new Image();
        newImg.src = URL.createObjectURL(blobArr[i]);
    
        //set image size 
        newImg.width = tl[i].charAt(0) * sz;
        newImg.height = tl[i].charAt(2) * sz;
    
        if(sz == sm) {
            smLT.push(newImg);
        } else if (sz == md) {
            mdLT.push(newImg);
        } else if (sz == lg) {
            lgLT.push(newImg);
        }
    }
}

function ProcessLetterImages() {

    PopulateImageArray(sm);
    PopulateImageArray(md);
    PopulateImageArray(lg);
    
    console.log("images in sm arr: " + smLT.length);
    console.log("images in md arr: " + mdLT.length);
    console.log("images in lg arr: " + lgLT.length);

    initProcessing = true;
    console.log("Images generated: " + (smLT.length + mdLT.length + lgLT.length));
}


function GenerateString(str, x, y, obj, sz, rnd, rnd2) {
    var s = 0; //spacing
    var n = 0;
    var ar;
    if(sz == sm) { // set string lib 
        ar = smLT;
    } else if (sz == md) {
        ar = mdLT;
    } else if (sz == lg) {
        ar = lgLT;
    }
    //get string
    for(var i=0; i<str.length;i++) {
        n = str.charCodeAt(i) - 97;
        
        if(ar[n]) { //check letter exists
            //console.log("Letter " + str[i] + " pos in alphabet: " + n);
            
            s += ar[n].width + 6;
            //console.log("Rendering " + str[i] 
            //    + " width is " + ar[n].width + " position: " + s);

            if((i == rnd) || (i == rnd2)) {
                CreateLetter(ar[Math.floor(Rand(0, ar.length))], obj, s + x, y);
            } else {
                CreateLetter(ar[n], obj, s + x, y);
            }
        }
        else {
        
            //console.log(Number.isInteger(n));
            console.log("letter not found "+ str[i] + " charCodeAt: " + n);
            s += sz*4;//blank or unknown
        }
    }
}
function CreateLetter(lt, obj, xIn, yIn) {
    
    const ASpt = Sprite({
        x: xIn,
        y: yIn,
        width: 32,
        height: 32,
        image: lt,
    });

    obj.addChild(ASpt);
}

//Build anything that has to wait for pixel objects to generate
//rnd is a random position for a glitch, -1 for none
function InitTitleObject(rnd, rnd2) {
    //test string hosting object
    titleObj = GameObject({
        x: 90,
        y: 90,
    });

    //img2.src = URL.createObjectURL(blobArr[28]);
    GenerateString("subspace zero", 0, 0, titleObj, lg, rnd, rnd2);
    //GenerateString("abcdefghijklmnopqrstuvwxyz", mdLT, md);

}

function InitPlayButton() {
    //test string hosting object
    startObj = Button({
        x: 250,
        y: 180,
        width: 95,
        height: 32,
        color: '#555555',

        onDown() {
            this.color = '#2C7DC3';
        },
        onUp() {
            this.color = '#555555';
        },
        onOver() {
            this.color = '#CCCCCC'
        },
        onOut: function() {
            this.color = '#555555'
        }
    });

    GenerateString("start", -12, 5, startObj, md, -1, -1);

}

function InitTxtObj(str, x, y, fs) {
    obj = GameObject({
        x: x,
        y: y,
    });

    //img2.src = URL.createObjectURL(blobArr[28]);
    GenerateString(str, 0, 0, obj, fs, -1, -1);

    addToRenderQueueUI(obj);
}