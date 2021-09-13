//Decoder functions, for decoding compressed pixel art image data
var blobArr = [];

const mimeType = 'image/png';

//Decompiles sprite data (HEX compress)
function DecomSpr(data, size, cvs, l) {
    //console.log("Decompiling: " + data);
    sD = data.split(",");

    //get dimensions 
    w = sD[0];
    h = sD[1];

    bin = [];
    rows = [];
    br = '';
    //convert each hex element into binary
    for(var i=2; i< sD.length; i++) {
        hex = hexToBinary(sD[i]);
        bin[bin.length] = hex;
        //console.log("Hex to Binary: " + hex);
    }

    //convert each binary number into rows
    for(var j=0; j < bin.length; j++) { //loop all binary strings
        for(var k=0; k<bin[j].length; k++) { //loop binary string
            br += bin[j].charAt(k);
            //slice n dice
            if(br.length == w) {
                //console.log("Binary section added to rows: " + br);
                rows.push(br);
                br = '' //reset
            }
        }
    }
    //reset canvas and draw
    cvs.width = w * size;
    cvs.height = h * size;
    
    var c = SelectColor(l);
    DrawToCvs(cvs.getContext("2d"), size, rows, c);

}

//used for quick and easy colour switching for certain images
function SelectColor(l) {
    return (
     l == 46 ? ('#FFFFFF22') //isogrid outline
    :l == 47 ? ('#FFFFFF99') //isogrid fill
    :l == 45 ? ('#0088FF') //isogrid fill
    :l == 51 ? ('#880000') //isogrid fill
    : null
    );

}

//draws decompiled sprite to canvas
//to be saved as image
function DrawToCvs(ctx, size, rows, col) {
    //colour from register
    if(col) {
        ctx.fillStyle = col;
        console.log("Custom fill style: " + col);
    } else { //default to white
        ctx.fillStyle = cR[0];
    }

    currX = 0;
    //loop through all pixel row strings
    //needed = [1,0,1][1,1,1]... (previous setup)
    for (var i = 0; i < rows.length; i++) { //each row element
        pixels = rows[i]; //
        currY = 0;
        //console.log("pixels: " + pixels);
        for (var y = 0; y < pixels.length; y++) {
            row = pixels[y];
            //console.log("Drawing row: " + row);
            for (var x = 0; x < row.length; x++) {
                if (row[x]==1) {
                    //console.log("Drawing row[x]: " + row[x]);
                    ctx.fillRect(currY + y * size, currX, size, size);
                }
            }
        }
        currY += size;
        currX += size;
    }
    //console.log('Drew ' + string + ' at size ' + size);
}

//First step in converting renderImage canvas to image data/compressed
function CvstoImData(cnv, num) {
    cntxt = cnv.getContext("2d");
    imageData = cntxt.getImageData(0, 0, cnv.width, cnv.height);
    // Convert canvas to Blob, then Blob to ArrayBuffer.
    cnv.toBlob((blob) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            //Set array buffer
            const arrayBuffer = reader.result;
            //Blob content -> Image & URL
                const blob = new Blob([arrayBuffer], {type: mimeType});        
                blobArr[num] = blob;

                //find out when processing is done
                if(blobArr.length == tl.length) {
                    isProc = true;
                }
        });
        reader.readAsArrayBuffer(blob);
    }, mimeType);
}
