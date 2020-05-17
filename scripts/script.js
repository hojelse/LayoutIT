let addPageButton;
let goRightButton;
let theDOMpage;
let imageInput;
let pageNumberSpan;
let textContainer;
let imageContainers;
let themes;
let currentTheme;
let themesFromApi;

let thisbook;
let collectionOfPages = [];
let pageAmount;
let currPageNumber;
let titleInput;

let chooseTheme;

let pageContainer;

let dragging = false;

let pageTextFactor = 20;
let pageMarginFactor = 2;
let marginsSlider;
let marginsOff;

let altTools;

class Book {
    pages = [];
    title = "title";
    theme = 0;
}

window.onload = function () {
    document.body.onmousemove = followCursor.run;
    document.body.addEventListener('touchmove', followCursor.touchrun);
    document.body.onmouseup = followCursor.end;
    document.body.addEventListener('touchend', followCursor.end);
    titleInput = this.document.getElementById("titleInput");
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("addPage").onclick = addPage;
    document.getElementById("addText").onclick = addTextField;
    document.getElementById("titleInput").onkeyup = this.updateTitle;
    this.document.querySelector('.marginsOn').addEventListener('click', showMarginsSlider)
    document.querySelector('#imgInput').addEventListener('change', uploadNewImg)

    document.onkeydown = firekey;

    themes = document.getElementsByName("theme");

    pageContainer = document.querySelector('.pageContainer');

    document.querySelector('.printAsPdf').onclick = printAsPdf;

    this.document.querySelector('.delete').onclick = deleteCurrentlySelectedImgBox;

    window.onresize = resizePage;

    theDOMpage = document.getElementById('page');
    addPageButton = document.getElementById('addPage');
    goLeftButton = this.document.getElementById('left');
    goRightButton = this.document.getElementById('right');
    imageInput = this.document.querySelector('#imgInput');
    pageNumberSpan = this.document.querySelector('.pageNumber');

    chooseTheme = this.document.getElementById("chooseTheme");

    textContainer = this.document.querySelector('.textContainer');

    altTools = this.document.querySelector('.altTools');

    marginsSlider = document.querySelector('.marginsSlider');
    marginsSlider.addEventListener('change', updatePageMarginFactor)
    marginsOff = this.document.querySelector('.marginsOff');
    marginsOff.addEventListener('click', closeAltTools);

    imageContainers = [
        this.document.querySelector('.imageContainer[data-id="0"]'),
        this.document.querySelector('.imageContainer[data-id="1"]'),
        this.document.querySelector('.imageContainer[data-id="2"]'),
        this.document.querySelector('.imageContainer[data-id="3"]')
    ]

    let aTags = this.document.querySelectorAll('a');
    for (let i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener('click', savePage)
    }

    thisbook = new Book();
    collectionOfPages.push(new Page(0));
    pageAmount = 1;
    currPageNumber = 1;

    getDataFromApi();
    chooseTheme.value = thisbook.theme;
}

function showMarginsSlider() {
    altTools.style.display = "flex";
}

function closeAltTools() {
    altTools.style.display = "none";
}

function updatePageMarginFactor() {
    pageMarginFactor = marginsSlider.value;
    resizePage();
}

function getDataFromApi() {

    fetch('https://itu-sdbg-s2020.now.sh/api/themes')
        .then(response => response.json())
        .then(data => {
            currentTheme = thisbook.theme;
            apiData = data.themes[currentTheme];
            theDOMpage.style.backgroundColor = apiData.styles.secondaryColor;
            themesFromApi = data.themes;
            setTheme(thisbook.theme);
            changeToCurrPage(theDOMpage);
            resizePage();
            resizeLayoutInit();
        })
        .catch(error => console.error(error));
}

function firekey(e) {
    e = e || window.event;

    switch (e.keyCode) {
        case 37:
            goLeft();
            break;
        case 39:
            goRight();
            break;
    }
}

class ImgBox {
    constructor() {
        let div = document.createElement("div");
        div.classList.add("imgBox");
        div.classList.add("draggable");
        this.div = div;
    }

    getDiv() {
        return this.div;
    }

    setURL(url) {
        this.url = url;
        this.div.style.backgroundImage = "url(" + url + ")";
    }
}

// customElements.define("img-box", ImgBox); // Påkræves for at extend standart DOM elementer

function fillImageBoxes(page, DOMPage) {
    let imageContainers = getImageContainersFromDOMPage(DOMPage);

    let collectionOfImgBoxes = page.collectionOfImgBoxes;

    for (let i = 0; i < imageContainers.length; i++) {
        if (collectionOfImgBoxes[i] == undefined) continue;
        imageContainers[i].appendChild(collectionOfImgBoxes[i].getDiv());
    }
    initDragAndDrop(); // drag drop
}

function setImageContainersResizeState(page, DOMPage){
    let imageContainers = getImageContainersFromDOMPage(DOMPage);

    for (let i = 0; i < imageContainers.length; i++) {
        imageContainers[i].style.flexGrow = page.resizeState[i];      
    }
}

function clearImageBoxes(DOMPage) {
    let imageContainers = getImageContainersFromDOMPage(DOMPage);
    for (let i = 0; i < imageContainers.length; i++) {
        imageContainers[i].innerHTML = "";
    }
}

function getImageContainersFromDOMPage(DOMPage) {
    let imageContainers = [
        DOMPage.querySelector('.imageContainer[data-id="0"]'),
        DOMPage.querySelector('.imageContainer[data-id="1"]'),
        DOMPage.querySelector('.imageContainer[data-id="2"]'),
        DOMPage.querySelector('.imageContainer[data-id="3"]')
    ]
    return imageContainers;
}

function uploadNewImg(event) {
    let url = URL.createObjectURL(event.target.files[0]);
    collectionOfPages[currPageNumber - 1].addImage(url);
}

function goLeft() {
    if (currPageNumber != 1) {
        savePage();
        currPageNumber -= 1;
        changeToCurrPage(theDOMpage);
    }
}

function goRight() {
    if (currPageNumber != pageAmount) {
        savePage();
        currPageNumber += 1;
        changeToCurrPage(theDOMpage);
    }
}

function updateTitle() {
    if (titleInput.value === "") {
        document.title = "Editor";
    } else {
        document.title = titleInput.value;
    }
}

function changeToCurrPage(DOMpage) {
    let currPage = collectionOfPages[currPageNumber - 1];
    updateDOMPageWithCurrentPage(DOMpage, currPage)
    setUpSelectableImgBox();
    setUpClickableImageContainer();

    if(currPageNumber === 1){
        goLeftButton.classList.add('button-disabled');
    } else {
        goLeftButton.classList.remove('button-disabled');
    }

    if (currPageNumber == pageAmount) {
        addPageButton.hidden = false;
        goRightButton.hidden = true;
    } else {
        addPageButton.hidden = true;
        goRightButton.hidden = false;
    }
}

function updateDOMPageWithCurrentPage(DOMpage, currPage) {
    clearImageBoxes(DOMpage)
    DOMpage.querySelector('.textContainer').innerHTML = ""
    let calPageNumber = currPage.pageNumber + 1;
    pageNumberSpan.innerText = calPageNumber + " of " + pageAmount;

    var textlist = currPage.texts;

    for (var i = 0; i < textlist.length; i++) {
        let text = textlist[i];
        setUpTextField(text, DOMpage);
    }
    
    setImageContainersResizeState(currPage, DOMpage);
    fillImageBoxes(currPage, DOMpage);
}

function setUpTextField(text, DOMpage) {
    var textField = document.createElement('div');
    textField.classList.add("pagetext");
    textField.setAttribute("contenteditable", "true");
    textField.innerText = "Sample text";
    textField.addEventListener('mousedown', followCursor.init);
    textField.addEventListener('touchstart', followCursor.init);
    textField.addEventListener("click", selectImgBox);
    textField.addEventListener('blur', function() {
        savePage();
        var target = event.target;
        var text = target.textContent;
        if(text.length === 0){
            target.remove();
        }
    });
    if(text.text === ""){
        textField.innerText = "Sample text";
    } else {
        textField.innerText = text.text;
    }
    let height = theDOMpage.getBoundingClientRect().height;
    let width = theDOMpage.getBoundingClientRect().width;
    textField.style.transform += "translateX("+ text.x * width +"px)";
    textField.style.transform += "translateY("+ text.y * height +"px)";
    textField.style.color = "#" + themesFromApi[currentTheme].styles.primaryColor;
    textField.style.fontFamily = themesFromApi[currentTheme].styles.fontFamily;
    textField.style.fontSize = text.size + "px";
    document.documentElement.style.setProperty('--fontFamilyPrint', themesFromApi[currentTheme].styles.fontFamily);  
    DOMpage.querySelector('.textContainer').appendChild(textField);
}

function addPage() {
    pageAmount++;
    collectionOfPages.push(new Page(pageAmount - 1));

    savePage();
    currPageNumber++;
    changeToCurrPage(theDOMpage);
}

function addTextField() {
    setUpTextField(new textObj(0,0,""), theDOMpage);
    savePage();
}


// Ratio for A-format pages (A4 A3 ect.)
// let aHeight = 1.414285714;
// let aWidth = 0.7070707;
let aHeight = 1;
let aWidth = 1;

function resizePage() {
    const pageConainerIsWide = pageContainer.offsetHeight / pageContainer.offsetWidth < aHeight;
    if (pageConainerIsWide) {
        pageContainer.style.flexDirection = "column";
        let newWidth = pageContainer.offsetHeight * aWidth + "px";
        theDOMpage.style.width = newWidth;
        document.documentElement.style.setProperty('--pageWidth', newWidth);
        theDOMpage.style.height = "auto";
    } else {
        pageContainer.style.flexDirection = "row";
        theDOMpage.style.height = pageContainer.offsetWidth * aHeight + "px";
        theDOMpage.style.width = "auto";
    }
    
    let page = collectionOfPages[currPageNumber - 1];
    let pagetexts = page.texts;
    
    let texts = document.querySelectorAll("#page .pagetext");
    let height = theDOMpage.getBoundingClientRect().height;
    let width = theDOMpage.getBoundingClientRect().width;   
    document.documentElement.style.setProperty('--page-margins', Math.round(height/100) * pageMarginFactor + "px");  
    for(let i = 0; i < texts.length; i++){
        texts[i].style.transform = "translate("+ pagetexts[i].x * width +"px , " + pagetexts[i].y * height + "px)";
        pagetexts[i].size = height / pageTextFactor;
        texts[i].style.fontSize = pagetexts[i].size + "px";
    }
}

function setThemeFromDropdown() {

    let selectedTheme = chooseTheme.value;
    currentTheme = selectedTheme;

    thisbook.theme = selectedTheme;

    setTheme(currentTheme);
}

function setTheme(theme) {
    theDOMpage.style.backgroundColor = "#" + themesFromApi[theme].styles.secondaryColor;

    let textFields = document.querySelectorAll('.pagetext');

    textFields.forEach(element => {
        element.style.color = "#" + themesFromApi[theme].styles.primaryColor;
        element.style.fontFamily = themesFromApi[theme].styles.fontFamily;
        document.documentElement.style.setProperty('--fontFamilyPrint', themesFromApi[theme].styles.fontFamily);        
    });
}

function savePage() {   
    let page = collectionOfPages[currPageNumber - 1];
    let textlist = page.texts;
    textlist.splice(0, textlist.length);

    for (let i = 0; i < imageContainers.length; i++) {
        page.resizeState[i] = imageContainers[i].style.flexGrow;
        thisbook.pages[currPageNumber-1] = page;
    }

    for (let i = 0; i < imageContainers.length; i++) {
        let div = imageContainers[i].querySelector('.imgBox');
        if(div !== null){
            let newImgBox = new ImgBox();
            newImgBox.div = div;
            thisbook.pages[currPageNumber-1].collectionOfImgBoxes[i] = newImgBox;
        } else {
            thisbook.pages[currPageNumber-1].collectionOfImgBoxes[i] = null;
        }
    }

    let pagetexts = theDOMpage.querySelectorAll('.pagetext');
    let newPageTexts = [];
    for (let i = 0; i < pagetexts.length; i++) {
        let thistext = pagetexts[i];
        let trans = window.getComputedStyle(thistext, null);
        let matrix = new WebKitCSSMatrix(trans.webkitTransform);
        let height = theDOMpage.getBoundingClientRect().height;
        let width = theDOMpage.getBoundingClientRect().width;

        newPageTexts.push(new textObj(matrix.m41/width, matrix.m42/height, thistext.innerText));
    }
    page.texts = newPageTexts;
}

class textObj{
    constructor(posX, posY, text){
        this.x = posX;
        this.y = posY;
        this.text = text;
        this.size = theDOMpage.getBoundingClientRect().height / pageTextFactor;
        
    }
}

function printAsPdf() {
    savePage();
    postPrintPages();
    resizePage();
    window.print();
    changeToCurrPage(theDOMpage);
}

function postPrintPages() {
    document.querySelectorAll('.page.onlyForPrint').forEach(onlyForPrintPage => {
        if(!(onlyForPrintPage === null || onlyForPrintPage === 'undefined')){
            onlyForPrintPage.remove();
        }
    });

    let pageContent = pageContainer.querySelector('.page');

    let numberOfPages = collectionOfPages.length;
    let root = document.documentElement;
    root.style.setProperty('--numberOfPages', numberOfPages + "00%");

    for (let i = 0; i < numberOfPages; i++) {
        let pageCopy = pageContent.cloneNode(true);
        pageCopy.removeAttribute('id');
        pageCopy.classList.add('onlyForPrint');
        updateDOMPageWithCurrentPage(pageCopy, collectionOfPages[i]);
        pageContainer.appendChild(pageCopy);
    }
}

function setUpClickableImageContainer() {
    let imageContainers = this.document.querySelectorAll('.imageContainer');
    for (let i = 0; i < imageContainers.length; i++) {
        if(imageContainers[i] === 'undefined' || imageContainers[i] === null) continue;
        imageContainers[i].addEventListener("click", uploadToThisContainer)
    }
}

function uploadToThisContainer() {

}

// selection of images
function setUpSelectableImgBox() {
    DOMImgBoxes = [
        this.document.querySelector('.imageContainer[data-id="0"] > .imgBox'),
        this.document.querySelector('.imageContainer[data-id="1"] > .imgBox'),
        this.document.querySelector('.imageContainer[data-id="2"] > .imgBox'),
        this.document.querySelector('.imageContainer[data-id="3"] > .imgBox')
    ]

    for (let i = 0; i < DOMImgBoxes.length; i++) {
        if(DOMImgBoxes[i] === 'undefined' || DOMImgBoxes[i] === null) continue;
        DOMImgBoxes[i].addEventListener("click", selectImgBox)
    }
}

let currentlySelectedImgBox = null;
let deleteButton = document.querySelector('.delete')

function selectImgBox() {
    if(currentlySelectedImgBox === event.currentTarget){      
        currentlySelectedImgBox.classList.remove('selectedImgBox');
        currentlySelectedImgBox = null;
    } else {
        if(currentlySelectedImgBox !== null) currentlySelectedImgBox.classList.remove('selectedImgBox');
        currentlySelectedImgBox = event.currentTarget;
        currentlySelectedImgBox.classList.add('selectedImgBox');
    }
    console.log(currentlySelectedImgBox);
}

function deleteCurrentlySelectedImgBox() {
    if(currentlySelectedImgBox === null) return;
    currentlySelectedImgBox.remove();
    savePage();
    changeToCurrPage(theDOMpage); 
}

function getMouseCoords(e) {
    var e = e || window.event;
    document.getElementsByClassName('pagetext').innerHTML = e.clientX + ', ' + e.clientY + '<br>' + e.screenX + ', ' + e.screenY;
}

var followCursor = (function(e) {
    var target = null;
    var prevClientX = null;
    var prevClientY = null;
    
    return {
        init: function() {
            target = event.target;
            dragging = true;
            target.style.border = '1px solid red';
        },

        end: function() {
            dragging = false;
            if(target != null){
                target.style.border = '1px solid #00000000'
                prevClientX = null;
                prevClientY = null;
                savePage();
            }
        },

        run: function(e) {
            if(Boolean(dragging)) {
                var e = e || window.event;
                if(prevClientX == null && prevClientY == null){
                    prevClientX = e.clientX;
                    prevClientY = e.clientY;
                }
                var transform = target.style.transform;
                var dragX = (prevClientX - e.clientX);
                var dragY = (prevClientY - e.clientY);
                target.style.transform += "translateX("+ -dragX +"px)";
                target.style.transform += "translateY("+ -dragY +"px)";
                prevClientX = e.clientX;
                prevClientY = e.clientY;
                getMouseCoords(e);
            }
        },

        touchrun: function(e) {
            if(Boolean(dragging)) {
                var e = e || window.event;
                if(prevClientX == null && prevClientY == null){
                    prevClientX = e.changedTouches[0].clientX;
                    prevClientY = e.changedTouches[0].clientY;
                }
                var transform = target.style.transform;
                var dragX = (prevClientX - e.changedTouches[0].clientX);
                var dragY = (prevClientY - e.changedTouches[0].clientY);
                target.style.transform += "translateX("+ -dragX +"px)";
                target.style.transform += "translateY("+ -dragY +"px)";
                prevClientX = e.changedTouches[0].clientX;
                prevClientY = e.changedTouches[0].clientY;
                getMouseCoords(e);
            }
        }
    };
}());
