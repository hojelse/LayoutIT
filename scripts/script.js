let addPageButton;
let goRightButton;
let page;

window.onload = function() {
    console.log("add functions")
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("addPage").onclick = addPage;
    document.getElementById("addText").onclick = addTextField;

    document.onkeydown = firekey;

    window.onresize = resizePage;

    page = document.getElementById('page');
    addPageButton = document.getElementById('addPage');
    goRightButton = this.document.getElementById('right');

    pageAmount++;
    collPages.push(new Page(pageAmount));
    
    currPage++;
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

var pageAmount = 0;
var currPage = 0;

var collPages = [];

class Page {
    constructor(pageNum) {
        this.pageNum = pageNum;
        this.texts = [];
    }
}

function goLeft() {
    if(currPage != 1){
        savePage();
        currPage -= 1;
        changeToCurrPage();
    }
}

function goRight() {
    if(currPage != pageAmount){
        savePage();
        currPage += 1;
        changeToCurrPage();
    }
}

function changeToCurrPage() {
    var page = document.getElementById('page');

    page.innerHTML = "";
    page.innerHTML = collPages[currPage-1].pageNum;

    var textlist = collPages[currPage-1].texts;
    
    for(var i = 0; i < textlist.length; i++){
        var textField = document.createElement('input');
        textField.classList.add("pagetext");
        textField.setAttribute("type", "text");
        textField.style.border = 'none';
        textField.placeholder = "Enter text here";
        textField.size = 16;
        textField.addEventListener('keyup', function() {
            var target = event.target;
            var text = target.value;
            if(text.length < 16) {
                target.size = 16;
            } else {
                target.size = text.length + 6;
            }
        })
        textField.value = textlist[i];
        page.appendChild(textField);
    }

    if(currPage == pageAmount){
        addPageButton.hidden = false;
        goRightButton.hidden = true;
    } else {
        addPageButton.hidden = true;
        goRightButton.hidden = false;
    }
}

function addPage() {
    pageAmount++;
    collPages.push(new Page(pageAmount));
    
    savePage();
    currPage++;
    changeToCurrPage();
}

function addTextField() {
    var textField = document.createElement('input');
    textField.classList.add("pagetext");
    textField.setAttribute("type", "text");
    textField.style.border = 'none';
    textField.placeholder = "Enter text here";
    textField.size = 16;
    textField.addEventListener('keyup', function() {
        var target = event.target;
        var text = target.value;
        if(text.length < 16) {
            target.size = 16;
        } else {
            target.size = text.length + 6;
        }
    })
    document.getElementById('page').appendChild(textField);
}

// var pctPageW = 80;
// var pctPageH = 100;

// Ratio for A-format pages (A4 A3 ect.)
var aHeight = 1.414285714;
var aWidth = 0.7070707;

function resizePage() {
    const pageContainer = document.querySelector('.pageContainer');

    const pageConainerIsWide = pageContainer.offsetHeight / pageContainer.offsetWidth < aHeight;
    if(pageConainerIsWide){
        pageContainer.style.flexDirection = "column";
        page.style.width = pageContainer.offsetHeight * aWidth + "px";
        page.style.height = "auto";
    } else {
        pageContainer.style.flexDirection = "row";
        page.style.height = pageContainer.offsetWidth * aHeight + "px";
        page.style.width = "auto";
    }
}

function savePage() {
    var page = collPages[currPage-1];
    var textlist = page.texts;
    textlist.splice(0,textlist.length);

    var pagetexts = document.getElementsByClassName('pagetext');
    for(var i = 0; i < pagetexts.length; i++){
        textlist.push(pagetexts[i].value);
    }
}