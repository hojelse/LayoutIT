window.onload = function() {
    console.log("add functions")
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("addPage").onclick = addPage;

    document.onkeydown = firekey;

    window.onresize = resizePage;

    addPage();
    changeToCurrPage();

    resizePage();
    
}

function firekey(e) {
    console.log("key fired");
    e = e || window.event;

    switch(e.keyCode){
        case 37:
            goLeft();
            break;
        case 39:
            goRight();
            break;
    }
}

var pageAmt = 0;
var currPage = 1;

var collPages = [];

class Page {
    constructor(pageNum) {
        this.pageNum = pageNum;
    }
}

function goLeft() {
    if(currPage != 1){
        currPage -= 1;
        changeToCurrPage();
    }
}

function goRight() {
    if(currPage != pageAmt){
        currPage += 1;
        changeToCurrPage();
    }
}

function changeToCurrPage() {
    var page = document.getElementById('page');

    page.innerHTML = collPages[currPage-1].pageNum;
}

function addPage() {
    pageAmt++;
    collPages.push(new Page(pageAmt));
    console.log(collPages.length);
}

// var pctPageW = 80;
// var pctPageH = 100;

// Ratio for A-format pages (A4 A3 ect.)
var aHeight = 1.414285714;
var aWidth = 0.7070707;

function resizePage() {
    var page = document.getElementById('pages').children[0];
    const pageContainer = document.querySelector('.pageContainer');

    if(pageContainer.clientHeight / pageContainer.clientWidth < aHeight){
        page.style.height = pageContainer.clientHeight + "px";
        page.style.width = pageContainer.clientHeight * aWidth + "px";
    } else {
        page.style.width = pageContainer.clientWidth + "px";
        page.style.height = pageContainer.clientWidth * aHeight + "px";
    }
}