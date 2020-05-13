window.onload = function() {
    console.log("add functions")
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("add").onclick = addPage;

    document.onkeydown = firekey;

    window.onresize = setPageStyleValues;

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
var pageAmt = 1;
var currPage = 1;

function goLeft() {
    if(currPage != 1){
        currPage -= 1;
        document.getElementById('pages').style.transform += "translateX("+ window.innerWidth +"px)";
    }
}

function goRight() {
    if(currPage != pageAmt){
        currPage += 1;
        document.getElementById('pages').style.transform += "translateX("+ -window.innerWidth +"px)";
    }
}

function addPage() {
    console.log("add");
    pageAmt++;
    document.getElementById('pages').style.width = (pageAmt * 100) + "%";

    var page = document.createElement('div');
    page.className = "page";
    page.innerText = pageAmt + "";
    document.getElementById('pages').appendChild(page);

    setPageStyleValues();
}

function setPageStyleValues(){
    var pctTotal = (1/pageAmt) * 100;
    var pctPage = (pctTotal/100) * pctPageW;
    var pctMargin = (pctTotal/100) * (100 - pctPageW);
    var pages = document.getElementById('pages').children;
    for(var i = 0; i < pages.length; i++){
        pages[i].style.width = pctPage + "%";
        pages[i].style.height = pages[i].clientWidth * 1.4142857;
        pages[i].style.marginLeft = (pctMargin/2) + "%";
        pages[i].style.marginRight = (pctMargin/2) + "%";
    }
}