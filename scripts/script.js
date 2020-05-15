let addPageButton;
let goRightButton;
let page;
let imageInput;
let pageNumberSpan;
let textContainer;
let imgBox0;
let imgBox1;
let imgBox2;
let imgBox3;
let imgBoxs;
let themes;
let currentTheme;
let themesFromApi;
let chooseTheme;


window.onload = function() {
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("addPage").onclick = addPage;
    document.getElementById("addText").onclick = addTextField;

    document.querySelector('#imgInput').addEventListener('change', uploadNewImg)

    document.onkeydown = firekey;
    console.log("set firekey event");

    themes = document.getElementsByName("theme");
    

    window.onresize = resizePage;

    page = document.getElementById('page');
    addPageButton = document.getElementById('addPage');
    goRightButton = this.document.getElementById('right');
    imageInput = this.document.querySelector('#imgInput')
    pageNumberSpan = this.document.querySelector('.pageNumber')

    chooseTheme = this.document.getElementById("chooseTheme");

    textContainer = this.document.querySelector('.textContainer')
    imgBox0 = this.document.querySelector('#imgBox0')
    imgBox1 = this.document.querySelector('#imgBox1')
    imgBox2 = this.document.querySelector('#imgBox2')
    imgBox3 = this.document.querySelector('#imgBox3')
    

    imgBoxes = [
        imgBox0,
        imgBox1,
        imgBox2,
        imgBox3
    ]

    pageAmount++;
    collectionOfPages.push(new Page(pageAmount));
    
    currPageNumber++;
    changeToCurrPage();
    resizePage();  

    getDataFromApi();


}


function getDataFromApi() {
    
    fetch('https://itu-sdbg-s2020.now.sh/api/themes')
    .then(response => response.json())
    .then(data => {
        apiData = data.themes[0];
        page.style.backgroundColor = apiData.styles.secondaryColor;
        textContainer.style.color = apiData.styles.primaryColor;

        themesFromApi = data.themes;
    })
    .catch(error => console.error(error));
}

function firekey(e) {
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

    addImage(img) {
        this.collectionOfImages.push(img)
        clearImageBoxes()
        fillImageBoxes(this.collectionOfImages)
    }
}

function fillImageBoxes(collectionOfImages) {
    for (let i = 0; i < imgBoxes.length; i++) {
        if(collectionOfImages[i] == undefined) continue;
        console.log(collectionOfImages[i].src);
        console.log(imgBoxes[i]);
        
        imgBoxes[i].style.backgroundImage = "url(" + collectionOfImages[i].src + ")";  
    }
}

function clearImageBoxes(){   
    for (let i = 0; i < imgBoxes.length; i++) {
        imgBoxes[i].style.backgroundImage = "none";
    }
}

function uploadNewImg(event){
    let url = URL.createObjectURL(event.target.files[0])
    let img = new Image();
    img.src = url;
    
    collectionOfPages[currPageNumber-1].addImage(img);
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
    clearImageBoxes()
    textContainer.innerHTML = ""
    let currPage = collectionOfPages[currPageNumber-1];
    pageNumberSpan.innerText = currPage.pageNumber;

    var textlist = currPage.texts;
    
    for(var i = 0; i < textlist.length; i++){
        let text = textlist[i];
        setUpTextField(text);
    }

    if(currPageNumber == pageAmount){
        addPageButton.hidden = false;
        goRightButton.hidden = true;
    } else {
        addPageButton.hidden = true;
        goRightButton.hidden = false;
    }
    fillImageBoxes(currPage.collectionOfImages);
}

function setUpTextField(text) {
    var textField = document.createElement('input');
    textField.classList.add("pagetext");
    textField.setAttribute("type", "text");
    textField.placeholder = "Enter text here";
    textField.style.background = "transparent";
    textField.addEventListener('keyup', function () {
        var target = event.target;
        var text = target.value;
        if (text.length < 16) {
            target.size = 16;
        }
        else {
            target.size = text.length + 6;
        }
    });
    textField.value = text;
    textContainer.appendChild(textField);
}

function addPage() {
    pageAmount++;
    collectionOfPages.push(new Page(pageAmount));
    
    savePage();
    currPageNumber++;
    changeToCurrPage();
    
}

function addTextField() {
    setUpTextField("");
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

/*
function getTheme(index) {
fetch('https://itu-sdbg-s2020.now.sh/api/themes')
.then(response => response.json())
.then(data => {
    apiData = data.themes[index];
    console.log(data.themes[index]); // Prints result from `response.json()` in getRequest
    console.log(data.themes[2].styles.secondaryColor);
})
.catch(error => console.error(error))
}
*/

function setThemeFromDropdown() {

    let selectedTheme = chooseTheme.value;

    console.log(selectedTheme);
    page.style.backgroundColor = themesFromApi[selectedTheme].styles.secondaryColor;
    textContainer.style.color = themesFromApi[selectedTheme].styles.primaryColor;
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