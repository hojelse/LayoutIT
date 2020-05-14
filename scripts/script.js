let addPageButton;
let goRightButton;
let page;
let imageInput;

window.onload = function() {
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("addPage").onclick = addPage;
    document.getElementById("addText").onclick = addTextField;

    document.querySelector('#imgInput').addEventListener('click', uploadNewImg)

    document.onkeydown = firekey;

    window.onresize = resizePage;

    page = document.getElementById('page');
    addPageButton = document.getElementById('addPage');
    goRightButton = this.document.getElementById('right');
    imageInput = this.document.querySelector('#imgInput')

    pageAmount++;
    collectionOfPages.push(new Page(pageAmount));
    
    currPageNumber++;
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

let pageAmount = 0;
let currPageNumber = 0;

let collectionOfPages = [];

class Page {
    collectionOfImages = []
    
    constructor(pageNumber) {
        this.pageNumber = pageNumber;
        this.texts = [];
    }
}

function uploadNewImg(){
    const reader = new FileReader();
    reader.onload = function () {
        let img = new Image();
        img.src = reader.result;
    };
    reader.readAsDataURL(imageInput.files[0]);
}

function goLeft() {
    if(currPageNumber != 1){
        savePage();
        currPageNumber -= 1;
        changeToCurrPage();
    }
}

function goRight() {
    if(currPageNumber != pageAmount){
        savePage();
        currPageNumber += 1;
        changeToCurrPage();
    }
}

function changeToCurrPage() {
    page.innerHTML = "";
    
    let currPage = collectionOfPages[currPageNumber-1];
    page.innerHTML = currPage.pageNumber;

    var textlist = currPage.texts;
    
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

    if(currPageNumber == pageAmount){
        addPageButton.hidden = false;
        goRightButton.hidden = true;
    } else {
        addPageButton.hidden = true;
        goRightButton.hidden = false;
    }
}

function addPage() {
    pageAmount++;
    collectionOfPages.push(new Page(pageAmount));
    
    savePage();
    currPageNumber++;
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


// Ratio for A-format pages (A4 A3 ect.)
let aHeight = 1.414285714;
let aWidth = 0.7070707;

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
    var page = collectionOfPages[currPageNumber-1];
    var textlist = page.texts;
    textlist.splice(0,textlist.length);

    var pagetexts = document.getElementsByClassName('pagetext');
    for(var i = 0; i < pagetexts.length; i++){
        textlist.push(pagetexts[i].value);
    }
}