window.onload = function() {
    console.log("add functions")
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("add").onclick = addPage;

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

var pctPageW = 80;
var pctPageH = 90;

function resizePage() {
    var page = document.getElementById('pages').children[0];
    if(window.innerHeight / window.innerWidth < 1.414285714){
        page.style.height = pctPageH + "%";
        page.style.width = page.clientHeight * 0.7070707;
    } else {
        page.style.width = pctPageW + "%";
        page.style.height = page.clientWidth * 1.414285714;
    }
}