//User interface setup
isProc = false; //is processed?
inc = 0; //incrementor

preTm = 2; //preload timer

//graphics 
sm = 2;
md = 4;
lg = 8;
//letter arrays
smLT = []; 
mdLT = [];
lgLT = [];
//sprite array
//spRT = [];

console.log("//Need to load " + tl.length*3 + " graphics sprites//");

//Setup all generated letters and images
function InitPreLoad() {
    for(var i=0; i< tl.length; i++) {
        //decompile
        DecomSpr(tl[i], 5, cCVS);
        CvstoImData(cCVS, i); 
    }
}

function ProcessSprites() {
    for(var i=0; i< px1.length; i++) {
        //decompile
        DecomSpr(px1[i], 5, cCVS);
        CvstoImData(cCVS, i); 
    }
}

//Process Letters and Numbers 
function ProcessLetters(){
    if(isProc) {
        if(preTm>0) { preTm-=0.1;
        } else {
            if(lgLT.length==0) {
                try {GenImAr(lg);
                }catch(err) {
                    lgLT.length=0;
                    lgLT=[];
                    console.log("it broke, trying again: " + err);
                    return;
                }
            } else if(lgLT.length==tl.length) {
                if(mdLT.length==0) {
                    try {GenImAr(md);
                    }catch(err) {
                        mdLT.length = 0;
                        mdLt = [];
                        console.log("it broke, trying again: " + err);
                        return; 
                    }
                } else if (mdLT.length == tl.length) {
                    if(smLT.length == 0) {
                        try {GenImAr(sm);
                        }catch(err) {
                            smLT.length = 0;
                            smLT = [];
                            console.log("it broke, trying again: " + err);
                            return;
                        }
                    } else if (smLT.length == tl.length) {
                        //ProcessSprites();
                        initProcessing = true;
                        console.log("Images generated: " + (smLT.length + mdLT.length + lgLT.length));
                    }
                }
            }
        }
    }
}

//make arrays for various letter images
function GenImAr(sz) {
    for(var i=0; i< blobArr.length; i++) {
        const Im = new Image();
        //kicking up issues
        Im.src = URL.createObjectURL(blobArr[i]);
        //set image size 
        Im.width = tl[i].charAt(0) * sz;
        Im.height = tl[i].charAt(2) * sz;
        
        sz==sm ? smLT.push(Im) :
        sz==md ? mdLT.push(Im) :
        sz==lg ? lgLT.push(Im) :
        null 
        
        // if(sz == sm) { smLT.push(Im);
        // } else if (sz == md) { mdLT.push(Im);
        // } else if (sz == lg) { lgLT.push(Im);
        // }
    }
}

//generate string or graphic
function GenStr(str, x, y, obj, sz, rnd, rnd2) {
    var s = 0; //spacing
    var ar;
    sz==sm ? ar = smLT :
    sz==md ? ar = mdLT :
    sz==lg ? ar = lgLT :
    null 
     
    //get string
    for(var i=0; i<str.length;i++) {
        var n = str.charCodeAt(i) - 97;
        if(ar[n]) { s += ar[n].width + sz;
            //console.log("Rendering " + str[i] 
            //    + " width is " + ar[n].width + " position: " + s);
            (i == rnd || i == rnd2) ?
                CreateLetter(ar[Math.floor(Rand(0, 35))], obj, s + x, y):
                CreateLetter(ar[n], obj, s + x, y) 
  
        } else {  
            var t = parseInt(str[i]);
            if(Number.isInteger(t)) {
                //console.log("its a number: " + t);
                //console.log("adding space: " + ar[t+26].width + sz*4);
                CreateLetter(ar[t+26], obj, s + x, y);
                s += ar[t+26].width + sz;
            } else {
                s += sz*4;//blank or unknown
                //console.log("symbol not found "+ str[i] + " charCodeAt: " + n);
            }
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
function InitTitle(rnd, rnd2) {
    //test string hosting object
    titleObj = GameObject({
        x: 90,
        y: 90,
    });
    //img2.src = URL.createObjectURL(blobArr[28]);
    GenStr("subspace zero", 0, 0, titleObj, lg, rnd, rnd2);
    //GenerateString("abcdefghijklmnopqrstuvwxyz", mdLT, md);

}

function InitStart() {
    //test string hosting object
    startObj = Button({
        type: '1',
        x: 270, //250
        y: 180,
        width: 95,
        height: 32,
        color: '#555',
        onDown() {
            this.color = '#38C';
            ButPress(this.type);
        },
        onUp() {
            this.color = '#555';
        },
        onOver() {
            this.color = '#CCC'
        },
        onOut: function() {
            this.color = '#555'
        }
    });
    //GenerateString("abcdefghijklmnopqrstuvwxyz", -12, 5, startObj, md, -1, -1);
    GenStr("start", -6, 5, startObj, md, -1, -1);

}

//MAKE text object
function MKTxt(str, x, y, fs) {
    obj = GameObject({
        x: x,
        y: y,
    });
    //img2.src = URL.createObjectURL(blobArr[28]);
    GenStr(str, 0, 0, obj, fs);
    addRQUI(obj);
}

//MAKE UI square
function MKSqr(x, y, w, h, c) {
    const sq = Sprite({
        x: x,y: y,
        color: c,
        width: w,height: h,});
    addRQUI(sq); 
}

//MAKE Button
function MKBt(x, y, w, h, c, i, str) {
    const bu = Button({
        type: i,
        x: x,y: y,
        color: c,
        width: w,height: h,
        onDown() {
            this.color = '#38C';
            ButPress(this.type);
        },
        onUp() { this.color = c; },
        onOver() { this.color = '#CCC'},
        onOut: function() { this.color = c
        }});
    addRQUI(bu); 
    if(str) {
        GenStr(str, -6, 5, bu, md, -1, -1);
    }
}

//all modular button functions
function ButPress(i) {
    i == 1 ? ( timer = 0.25, sceneChange = 1) 
    : i == 2 ? ( timer = 0.25, sceneChange = 2)
    : i == 69 ? ( timer = 0.25, sceneChange = 0)
    : null
}