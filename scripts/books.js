var currentBookData;
let localBooks;

window.onload = function() {
    window.addEventListener('resize', resize);

    updateBookList();
    resize();
}

function addBook() {
    window.location.href = "./editor.html";
}

function openBook() {
    e = window.event;
    var target = e.target || e.srcElement;
    var book = target.children;
    var title = book[0].innerHTML;

    window.location.href = "./pages.html"
}

function resize() {
    const bookList = document.getElementById("bookList");
    const bookContainer = document.getElementById("bookContainer");

    bookList.style.width = 220 * Math.min(parseInt(bookContainer.offsetWidth/220), localBooks.length) + "px";
}

async function updateBookList() {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    const addBookButton = document.createElement("div");
    addBookButton.className = 'book button unselectable';
    addBookButton.onclick = addBook;

    const icon = document.createElement("img");
    icon.src = './assets/plus.svg';
    icon.className =  'addNew';

    addBookButton.appendChild(icon);
    bookList.appendChild(addBookButton);
}

function setTheme(currentBookElement) {
    /* mangler fonts*/
    fetch('https://itu-sdbg-s2020.now.sh/api/themes')
    .then(response => response.json())
    .then(data => {
        const index = currentBookData.theme;
        apiData = data.themes[index];
        console.log(apiData);
        currentBookElement.style.backgroundColor = "#" + apiData.styles.secondaryColor;
        currentBookElement.style.color = "#" + apiData.styles.primaryColor;
        currentBookElement.style.fontFamily = apiData.styles.fontFamily;
    })
    .catch(error => console.error(error))
}
