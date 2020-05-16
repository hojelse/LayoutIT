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

class Book {
    pages = [];
    title = "title";
    theme = 0;
}

window.onload = function () {
    titleInput = this.document.getElementById("titleInput");
    document.getElementById("left").onclick = goLeft;
    document.getElementById("right").onclick = goRight;
    document.getElementById("addPage").onclick = addPage;
    document.getElementById("addText").onclick = addTextField;
    document.getElementById("titleInput").onkeyup = this.updateTitle;

    document.querySelector('#imgInput').addEventListener('change', uploadNewImg)

    document.onkeydown = firekey;

    themes = document.getElementsByName("theme");

    pageContainer = document.querySelector('.pageContainer');

    document.querySelector('.printAsPdf').onclick = printAsPdf;

    window.onresize = resizePage;

    theDOMpage = document.getElementById('page');
    addPageButton = document.getElementById('addPage');
    goRightButton = this.document.getElementById('right');
    imageInput = this.document.querySelector('#imgInput');
    pageNumberSpan = this.document.querySelector('.pageNumber');

    chooseTheme = this.document.getElementById("chooseTheme");

    textContainer = this.document.querySelector('.textContainer');


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
    //startUp();
    getDataFromApi();
    chooseTheme.value = thisbook.theme;

}

function startUp() {
    let localBooks = JSON.parse(localStorage.getItem("booklist"));
    let currBook = localStorage.getItem("currBook");
    for (let i = 0; i < localBooks.length; i++) {
        if (localBooks[i].title == currBook) {
            thisbook = localBooks[i];
        }
    }

    // Cast pages
    let tempCollectionOfPages = [];
    for (let i = 0; i < thisbook.pages.length; i++) {
        let tempPage = Object.assign(new Page(i), thisbook.pages[i]);
        let tempCollectionOfImgBoxes = [null,null,null,null];
        for (let i = 0; i < tempPage.collectionOfImgBoxes.length; i++) {
            if (tempPage.collectionOfImgBoxes[i] === null) continue;
            let tempImgBox = Object.assign(new ImgBox(), tempPage.collectionOfImgBoxes[i]);
            let tempDiv = document.createElement("div");
            tempDiv.classList.add("imgBox");
            tempDiv.classList.add("draggable");
            tempImgBox.div = tempDiv;
            tempImgBox.setURL(tempImgBox.url);         
            tempCollectionOfImgBoxes[i] = tempImgBox;
        }
        tempPage.collectionOfImgBoxes = tempCollectionOfImgBoxes;
        tempCollectionOfPages[i] = tempPage;
    }
    collectionOfPages = tempCollectionOfPages;

    pageAmount = collectionOfPages.length;
    currPageNumber = parseInt(localStorage.getItem("clickedPage"));
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
    let url = URL.createObjectURL(event.target.files[0])
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
    // setUpSelectableImgBox();

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
    pageNumberSpan.innerText = currPage.pageNumber + 1;

    console.log(currPage.texts);
    

    var textlist = currPage.texts;

    for (var i = 0; i < textlist.length; i++) {
        let text = textlist[i];
        setUpTextField(text, DOMpage);
    }
    
    setImageContainersResizeState(currPage, DOMpage);
    fillImageBoxes(currPage, DOMpage);
}

function setUpTextField(text, DOMpage) {
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
    textField.style.color = "#" + themesFromApi[currentTheme].styles.primaryColor;
    textField.style.fontFamily = themesFromApi[currentTheme].styles.fontFamily;
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
    setUpTextField("", theDOMpage);
}


// Ratio for A-format pages (A4 A3 ect.)
let aHeight = 1.414285714;
let aWidth = 0.7070707;

function resizePage() {
    const pageConainerIsWide = pageContainer.offsetHeight / pageContainer.offsetWidth < aHeight;
    if (pageConainerIsWide) {
        pageContainer.style.flexDirection = "column";
        theDOMpage.style.width = pageContainer.offsetHeight * aWidth + "px";
        theDOMpage.style.height = "auto";
    } else {
        pageContainer.style.flexDirection = "row";
        theDOMpage.style.height = pageContainer.offsetWidth * aHeight + "px";
        theDOMpage.style.width = "auto";
    }
}

function setThemeFromDropdown() {

    let selectedTheme = chooseTheme.value;
    currentTheme = selectedTheme;

    thisbook.theme = selectedTheme;
    let localBooks = JSON.parse(localStorage.getItem("booklist"));
    let currBook = localStorage.getItem("currBook");
    for (var i = 0; i < localBooks.length; i++) {
        if (localBooks[i].title == currBook) {
            localBooks[i] = thisbook;
        }
    }
    localStorage.setItem("booklist", JSON.stringify(localBooks));

    setTheme(currentTheme);
}

function setTheme(theme) {
    theDOMpage.style.backgroundColor = "#" + themesFromApi[theme].styles.secondaryColor;

    let textFields = document.querySelectorAll('.pagetext');

    textFields.forEach(element => {
        element.style.color = "#" + themesFromApi[theme].styles.primaryColor;
        element.style.fontFamily = themesFromApi[theme].styles.fontFamily;
    });
}

function savePage() {   
    var page = collectionOfPages[currPageNumber - 1];
    var textlist = page.texts;
    textlist.splice(0, textlist.length);

    for (let i = 0; i < imageContainers.length; i++) {
        page.resizeState[i] = imageContainers[i].style.flexGrow;
        thisbook.pages[currPageNumber-1] = page;
    }

    var pagetexts = theDOMpage.querySelectorAll('.pagetext');
    let newPageTexts = [];
    for (var i = 0; i < pagetexts.length; i++) {
        newPageTexts.push(pagetexts[i].value);
    }
    page.texts = newPageTexts;

    let localBooks = JSON.parse(localStorage.getItem("booklist"));
    for (var i = 0; i < localBooks.length; i++) {
        if (localBooks[i].title == localStorage.getItem("currBook")) {
            localBooks[i] = thisbook;          
        }
    }
    localStorage.setItem("booklist", JSON.stringify(localBooks));
}

function printAsPdf() {
    savePage();
    postPrintPages();
    window.print();
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

// let currentlySelectedImgBox = null;

// function setUpSelectableImgBox() {
//     DOMImgBoxes = [
//         this.document.querySelector('.imageContainer[data-id="0"] > .imgBox'),
//         this.document.querySelector('.imageContainer[data-id="1"] > .imgBox'),
//         this.document.querySelector('.imageContainer[data-id="2"] > .imgBox'),
//         this.document.querySelector('.imageContainer[data-id="3"] > .imgBox')
//     ]

//     for (let i = 0; i < DOMImgBoxes.length; i++) {
//         if(DOMImgBoxes[i] === 'undefined' || DOMImgBoxes[i] === null) continue;
//         DOMImgBoxes[i].addEventListener("click", selectImgBox)
//     }
// }

// function selectImgBox() {
//     console.log(event.currentTarget);
// }