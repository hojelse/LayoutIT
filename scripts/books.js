var currentBookData;
let localBooks;

window.onload = function() {
    window.addEventListener('resize', resize);

    startUp();

    updateBookList();
    resize();
}

function startUp() {
    if(localStorage.getItem('booklist') == null){
        localStorage.setItem("booklist", JSON.stringify([]));
    }
    localStorage.setItem("currBook", "");
    localStorage.setItem("clickedPage", "");
}

class Book {
    pages = [];
    title = "title";
    theme = 0;
}

function addBook() {
    console.log("hello");
    let books = JSON.parse(localStorage.getItem("booklist"));
    let newBook = new Book();
    books.push(newBook);
    localStorage.setItem("booklist", JSON.stringify(books));

    window.location.href = "./pages.html";
}

function openBook() {
    e = window.event;
    var target = e.target || e.srcElement;
    var book = target.children;
    var title = book[0].innerHTML;
    
    localStorage.setItem("currBook", title);

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

    localBooks = JSON.parse(localStorage.getItem("booklist"));
    for(i = 0; i < localBooks.length; i++) {
        currentBookData = localBooks[i];
        const book = document.createElement("div");
        book.className = 'book';
        book.onclick = openBook;

        setTheme(book);

        const title = document.createElement("div");
        title.appendChild(document.createTextNode(localBooks[i].title));
        book.appendChild(title);

        const edit = document.createElement("a");
        edit.className = 'hoverButton';
        edit.href = './pages.html';

        const editIcon = document.createElement("img");
        editIcon.src = './assets/edit.svg';
        editIcon.className = 'icon';
        edit.appendChild(editIcon);
        book.appendChild(edit);

        const print = document.createElement("a");
        print.className = 'hoverButton';

        const printIcon = document.createElement("img");
        printIcon.src = './assets/print.svg';
        printIcon.className = 'icon';
        print.appendChild(printIcon);
        book.appendChild(print);

        bookList.appendChild(book);

        book.onmouseenter = function() {
            edit.style.visibility = 'visible';
            print.style.visibility = 'visible';
        }

        book.onmouseleave = function() {
            edit.style.visibility = 'hidden';
            print.style.visibility = 'hidden';
        }

        const spacing = (book.offsetHeight-2*edit.offsetHeight)/3;
        edit.style.bottom = spacing + "px";
        print.style.bottom = spacing*2 + edit.offsetHeight + "px";
    }
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
