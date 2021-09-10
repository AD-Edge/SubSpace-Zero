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


function GenerateString(str, ar, sz) {
    var s = 0; //spacing

    //get string
    for(var i=0; i<str.length;i++) {
        var n = str.charCodeAt(i) - 97;

        if(ar[n]) { //check letter exists
            //console.log("Letter " + str[i] + " pos in alphabet: " + n);
            
            s += ar[n].width + 6;
            console.log("Rendering " + str[i] 
                + " width is " + ar[n].width + " position: " + s);
    
            CreateLetter(ar[n], s, 0);
        }
        else {
            s += sz*4;//blank or unknown
        }
    }
}
function CreateLetter(lt, xIn, yIn) {
    
    const ASpt = Sprite({
        x: xIn,
        y: yIn,
        width: 32,
        height: 32,
        image: lt,
    });

    titleObj.addChild(ASpt);
}

//Build anything that has to wait for pixel objects to generate
function InitTitleObject() {
        
    //test string hosting object
    titleObj = Sprite({
        x: 90,
        y: 90,
        width: 400,
        height: 32,
        //image: imageArray[0],

        render: function() {
            // this.draw();
            // this.context.strokeStyle = 'red';
            // this.context.lineWidth = 1;
            // this.context.strokeRect(0, 0, this.width, this.height);
        }
    });

    //img2.src = URL.createObjectURL(blobArr[28]);
    GenerateString("subspace zero", lgLT, lg);
    //GenerateString("abcdefghijklmnopqrstuvwxyz", mdLT, md);
    //GenerateString("alex delderfield", mdLT, md);
}