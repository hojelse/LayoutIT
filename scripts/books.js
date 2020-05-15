window.onload = function() {
    
    window.addEventListener('resize', resize);
    document.getElementById('addbook').onclick = addBook;

    startUp();

    updateBookList();
    resize();
}

function startUp() {
    if(localStorage.getItem('booklist') == "[]"){
        localStorage.setItem("booklist", JSON.stringify([]));
    }
    localStorage.setItem("currBook", "");
    localStorage.setItem("clickedPage", "");
}

class Book {
    pages = [];
    title = "title";
}

function addBook() {
    let books = JSON.parse(localStorage.getItem("booklist"));
    let newBook = new Book();
    books.push(newBook);
    localStorage.setItem("booklist", JSON.stringify(books));

    updateBookList();
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

    bookList.style.width = 220 * parseInt(bookContainer.offsetWidth/220) + "px";
}

async function updateBookList() {
    /* Der mangeler API kald i denne funktion */
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    let localBooks = JSON.parse(localStorage.getItem("booklist"));
    for(i = 0; i < localBooks.length; i++) {
        const book = document.createElement("div");
        book.className = 'book unselectable';
        book.onclick = openBook;

        const title = document.createElement("div");
        title.appendChild(document.createTextNode(localBooks[i].title));
        book.appendChild(title);

        const view = document.createElement("a");
        view.className = 'hoverButton';
        view.onmouseup = function() {view.click()}
        /* printLabel is a placeholder for an icon */
        const viewLabel = document.createElement("div");
        viewLabel.appendChild(document.createTextNode("view"));
        view.appendChild(viewLabel);
        book.appendChild(view);

        const edit = document.createElement("a");
        edit.className = 'hoverButton';
        edit.href = './pages.html';
        edit.onmouseup = function() {edit.click()}
        /* editLabel is a placeholder for an icon */
        const editLabel = document.createElement("div");
        editLabel.appendChild(document.createTextNode("edit"));
        edit.appendChild(editLabel);
        book.appendChild(edit);

        const print = document.createElement("a");
        print.className = 'hoverButton';
        print.onmouseup = function() {print.click()}
        /* printLabel is a placeholder for an icon */
        const printLabel = document.createElement("div");
        printLabel.appendChild(document.createTextNode("print"));
        print.appendChild(printLabel);
        book.appendChild(print);

        bookList.appendChild(book);

        book.onmousedown = function() {
            view.style.visibility = 'visible';
            edit.style.visibility = 'visible';
            print.style.visibility = 'visible';
        }

        book.onmouseup = function() {
            view.style.visibility = 'hidden';
            edit.style.visibility = 'hidden';
            print.style.visibility = 'hidden';
        }

        const spacing = (book.offsetHeight-3*view.offsetHeight)/4;
        view.style.bottom = spacing*3 + view.offsetHeight*2 + "px"
        edit.style.bottom = spacing*2 + view.offsetHeight + "px";
        print.style.bottom = spacing + "px";
    }
}