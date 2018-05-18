var fs=require('fs');
//=====algorithm=====
//=====基本====
//1.使用動態規劃求二項式係數
//(30,12),(50,12)
//二項式係數(動態規劃版)
function bindp(n,k) {   //input n,k & n>=k
    //建立[n+1][k]二維陣列
    var B=new Array(n+1);
    for(var i=0; i<=n; i++){
        B[i]=new Array(k);
    }
    //檢查B[i][j]是否為首末項是則設1；否則設為上一列中同項與前項之和
    for(var i=0; i<=n; i++){
        for(var j=0;j<=Math.min(i,k-1);j++){
            if(j==0||j==i){
                B[i][j]=1;
            }else{
                B[i][j]=B[i-1][j-1]+B[i-1][j];
            }
        }
    }
    //逐行印出
    for(var i=0; i<=n; i++){
        var str="";
        for(var j=0; j<k; j++){
            if(B[i][j]){
                B[i][j]=("             "+B[i][j]).slice(-13);//每個數字佔13位數
                str+=B[i][j];
            }
        }
        console.log(str);
    }
    // console.log(B);
}

//2.使用動態規劃求
//2-1 分割資料
function datasplit(data){   //將資料轉為陣列
    var lines=data.split("\n");
    var arr=new Array();
    lines.forEach((line) => {
        arr.push(line);
    });
    var n=arr[0];
    var arrW=arr.slice(1,arr.length);
    arr=[];
    arrW.forEach((line) => {
        arr.push(line.split("  ").map(Number));
    });
    //arr=arr[0];
    //console.log(arr);
    return [n,arr];
}

//2-2建立相鄰矩陣
function buildarrW(n,data){ 
    // 建立空白相鄰矩陣並全部填0
    var arrW=new Array(Number(n));
    for(var i=0; i<arrW.length;i++){
        arrW[i]=new Array(Number(n));
        for(var j=0; j<arrW[i].length; j++){
            arrW[i][j]=0;
        }
    }
    // console.log(arrW.length);
    // console.log(n);
    //將 圖/檔案 之陣列填入相鄰矩陣
    for(var i=0; i<data.length;i++){
        // console.log("data:"+data[i][0]+" "+data[i][1]+" "+data[i][2]);
        if(data[i][2]){
            arrW[data[i][0]-1][data[i][1]-1]=data[i][2];
        }
    }
    //console.log(arrW);
    //將剩餘空位填入Infinity
    for(var i=0; i<n; i++){
        for(j=0; j<n; j++){
            if(arrW[i][j]==0&&i!=j){
                arrW[i][j]=Infinity;
            }
        }
    }
    //console.log(arrW);
    return arrW;
}

//2-3.1佛洛伊德最短路徑演算法
function floydD(n,arrW){    
    var arrD=arrW.map(function(arr){
        return arr.slice();
    });
    // console.log(arrD);
    for(var k=1; k<n; k++){
        for(var i=0; i<n;i++){
            for(var j=0; j<n;j++){
                arrD[i][j]=Math.min(arrD[i][j],arrD[i][k-1]+arrD[k-1][j]);
            }
        }
    }
    // console.log(arrD);
    return arrD;
}

//2-3.2佛洛伊德最短路徑演算法(變異)
function floydP(n,arrW){    
    var arrD=arrW.map(function(arr){
        return arr.slice();
    });

    var arrP=new Array(Number(n));
    for(var i=0; i<arrP.length;i++){
        arrP[i]=new Array(Number(n));
        for(var j=0; j<arrP[i].length; j++){
            arrP[i][j]=0;
        }
    }
    // console.log(arrD);
    for(var k=1; k<n; k++){
        for(var i=0; i<n;i++){
            for(var j=0; j<n;j++){
                if(arrD[i][k-1]+arrD[k-1][j]<arrD[i][j]){
                    arrP[i][j]=k;
                    arrD[i][j]=arrD[i][k-1]+arrD[k-1][j];
                }
            }
        }
    }
    // console.log(arrD);
    // console.log(arrP);
    return [arrD,arrP];
}

//2-4印出最短路徑
function printpath(arrP,q,r){
    
    if(arrP[q-1][r-1]!=0){
        printpath(arrP,q,arrP[q-1][r-1]);
        console.log("經頂點 "+arrP[q-1][r-1]);
        printpath(arrP,arrP[q-1][r-1],r);
    }
}

//=====進階=====
//3.序列對齊演算法
function seqAlignParseStr(strX,strY){
    var arrX=strX.split("");
    var arrY=strY.split("");
    // console.log("arrX: %s arrY: %s",arrX,arrY);
    return{arrX:arrX,arrY:arrY}
}

function seqAlignInit(arrX, arrY){
    var arrXY = new Array(Number(arrX.length+1));
    for(let i=0;i<arrXY.length;i++){
        arrXY[i] = new Array(Number(arrY.length+1));
    }
    return arrXY;
}

var seqAlignTable=(arrX,arrY,arrXY,penalty, gap)=>{
    var m=arrX.length,n=arrY.length;
    for(let i=m; i>=0; i--){
        for(let j=n; j>=0; j--){
            if(i==m){
                arrXY[i][j]=2*(n-j);
            }else if(j==n){
                arrXY[i][j]=2*(m-i);
            }else{
                var checkpen=()=>{
                    if(arrX[i]==arrY[j]){
                        return 0;
                    }else {
                        return penalty;
                    }
                }
                // console.log(arrXY[i+1][j+1] + checkpen() ,arrXY[i+1][j]+gap, arrXY[i][j+1]+gap,checkpen());
                arrXY[i][j]=Math.min(arrXY[i+1][j+1] + checkpen() ,arrXY[i+1][j]+gap, arrXY[i][j+1]+gap);
            }
        }
    }
    return arrXY;
}

var seqAlignCheck = (arrX, arrY, arrXY, penalty, gap)=>{
    var m=arrX.length-1,n=arrY.length-1;
    let i=0,j=0,pentotal=0,dnaX=arrX[0],dnaY=arrY[0];
    // console.log(arrXY);
    while(i<m||j<n){
        // console.log(arrXY[i][j],arrXY[i][j+1],arrXY[i+1][j]);
        if(Number(arrXY[i][j])==Number(arrXY[i][j+1])+gap){
            j++;
            if(arrY[j]){
                dnaX+="-";
                dnaY+=arrY[j];
            }
            pentotal+=gap;
        }else if(Number(arrXY[i][j])==Number(arrXY[i+1][j])+gap){
            i++;
            if(arrX[i]){
                dnaX+=arrX[i];
                dnaY+="-";
            }
            pentotal+=gap;
        }else{
            i++;j++;
            if(arrX[i]){
                dnaX+=arrX[i];
            }else{
                dnaX+="-";
            }
            if(arrY[j]){
                dnaY+=arrY[j];
            }else{
                dnaY+="-";
            }
            if(arrX[i]!=arrY[j]){pentotal+=penalty;}
        }
        // console.log("DnaX: "+dnaX+" DnaY: "+dnaY+" pentotal: "+pentotal);
    }
    return {dnaX:dnaX, dnaY:dnaY, pentotal:pentotal};
}


//execute
//基本

//BinDP
function BinDPTest(){
    console.log("BinDP(30,12)");
    bindp(30,12);
    console.log("\nBinDP(50,12)");
    bindp(50,12);
}

//Floyd
function floydDTestEasy(){

    var data=
    `6
1  4  1
1  5  5
1  6  2
2  1  9
2  3  3
2  4  2
3  4  4
4  3  2
4  5  3
5  1  3
6  2  1`;

    var arr = datasplit(data);
    var arrW = buildarrW(arr[0],arr[1]);
    //var arrD = floydD(arr[0],arrW);
    var arrDP=floydP(arr[0],arrW);
    // var arrD=arrDP[0];
    // var arrP=arrDP[1];
    console.log("V5 -> V3")
    printpath(arrDP[1],5,3);



    /*
    var arrW=[
        [0,Infinity,Infinity,1,5,2],
        [9,0,3,2,Infinity,Infinity],
        [Infinity,Infinity,0,4,Infinity,Infinity],
        [Infinity,Infinity,2,0,3,Infinity],
        [3,Infinity,Infinity,Infinity,0,Infinity],
        [Infinity,1,Infinity,Infinity,Infinity,0]
    ]
    */
    //floydD(6,arrW);
}

//加分

function floydDTestHard(){

    var filename="./data500.txt";
    var floydfile = read(filename,(data)=>{
        // console.log(data);
        var arr = datasplit(data);
        var arrW = buildarrW(arr[0],arr[1]);
        //var arrD = floydD(arr[0],arrW);
        var arrDP=floydP(arr[0],arrW);
        // var arrD=arrDP[0];
        // var arrP=arrDP[1];
        console.log("V400 -> V11");
        printpath(arrDP[1],400,11);
        console.log("V248 -> V400");
        printpath(arrDP[1],248,400);
    });
}

//=====進階=====

var seqAlign=(strX,strY,penalty,gap)=>{
    var arr=seqAlignParseStr(strX,strY);
    var arrX=arr.arrX;
    var arrY=arr.arrY;
    var arrXY=seqAlignInit(arrX,arrY);
    arrXY=seqAlignTable(arrX,arrY,arrXY,penalty,gap);
    var result = seqAlignCheck(arrX,arrY,arrXY,penalty,gap);
    var dnaX=result.dnaX;
    var dnaY=result.dnaY;
    var pentotal=result.pentotal;
    // console.log("DnaX: "+dnaX+" DnaY: "+dnaY+" pentotal: "+pentotal);
    return result;
}

var multiseqAlignCompare=(compare,arrStr,penalty,gap)=>{
    var result=[];
    for(let i=0; i<arrStr.length; i++){
        // console.log(compare,arrStr[i],penalty,gap);
        result.push(seqAlign(compare,arrStr[i],penalty,gap));
    }
    console.log(result);
}

//Test
//基本
//BinDPTest();
//floydDTestEasy();

//加分
//floydDTestHard();

//進階





//fs read
function read(file, callback){
    fs.readFile(file, 'utf8', function(err,data){
        if (err){
            console.log(err);
        }
        callback(data);
    });
}
//execute
//基本

//BinDP
function BinDPTest(){
    console.log("BinDP(30,12)");
    bindp(30,12);
    console.log("\nBinDP(50,12)");
    bindp(50,12);
}

//Floyd
function floydDTestEasy(){

    var data=
    `6
1  4  1
1  5  5
1  6  2
2  1  9
2  3  3
2  4  2
3  4  4
4  3  2
4  5  3
5  1  3
6  2  1`;

    var arr = datasplit(data);
    var arrW = buildarrW(arr[0],arr[1]);
    //var arrD = floydD(arr[0],arrW);
    var arrDP=floydP(arr[0],arrW);
    // var arrD=arrDP[0];
    // var arrP=arrDP[1];
    console.log("V5 -> V3")
    printpath(arrDP[1],5,3);



    /*
    var arrW=[
        [0,Infinity,Infinity,1,5,2],
        [9,0,3,2,Infinity,Infinity],
        [Infinity,Infinity,0,4,Infinity,Infinity],
        [Infinity,Infinity,2,0,3,Infinity],
        [3,Infinity,Infinity,Infinity,0,Infinity],
        [Infinity,1,Infinity,Infinity,Infinity,0]
    ]
    */
    //floydD(6,arrW);
}

//加分



function floydDTestHard(){

    var filename="./data500.txt";
    var floydfile = read(filename,(data)=>{
        // console.log(data);
        var arr = datasplit(data);
        var arrW = buildarrW(arr[0],arr[1]);
        //var arrD = floydD(arr[0],arrW);
        var arrDP=floydP(arr[0],arrW);
        // var arrD=arrDP[0];
        // var arrP=arrDP[1];
        console.log("V400 -> V11");
        printpath(arrDP[1],400,11);
        console.log("V248 -> V400");
        printpath(arrDP[1],248,400);
    });
}

//=====進階=====
function seqAlignTest(){
    seqAlign("GTACCCCAT","TGACCGCA",1,2);
    multiseqAlignCompare("學問是資管系",["資管系有帥哥","資管界美女","淡江大學有很好的資管系"],3,2);
}

//Test
//基本
//BinDPTest();
//floydDTestEasy();

//加分
// floydDTestHard();

//進階
console.time("seqAlign");
seqAlignTest();
console.timeEnd("seqAlign");



//fs read
function read(file, callback){
    fs.readFile(file, 'utf8', function(err,data){
        if (err){
            console.log(err);
        }
        callback(data);
    });
}