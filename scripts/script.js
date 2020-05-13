window.onload = function() {
    console.log("add functions")
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("add").onclick = addPage;

    document.onkeydown = firekey;

    window.onresize = setPageStyleValues;

    addPage();
    changeToCurrPage();

    setPageStyleValues();
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

var pctPageW = 20;
var pageAmt = 0;
var currPage = 1;

var collPages = [];

class Page {
    constructor(pageNum){
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

function changeToCurrPage(){
    var page = document.getElementById('page');

    page.innerHTML = collPages[currPage-1].pageNum;
}

function addPage() {
    pageAmt++;
    collPages.push(new Page(pageAmt));
    console.log(collPages.length);
}

function setPageStyleValues(){
    var page = document.getElementById('pages').children[0];

        page.style.width = pctPageW + "%";
        page.style.height = page.clientWidth * 1.4142857;

        var margin = (100 - pctPageW) / 2;
        page.style.marginLeft = margin + "%";
        page.style.marginRight = margin + "%";
}