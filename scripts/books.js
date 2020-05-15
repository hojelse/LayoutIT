var totalBooks = 5;

window.onload = function() {
    console.log("books");
    window.addEventListener('resize', resize);
    document.getElementById('addbook').onclick = addBook;

    startUp();

    updateBookList();
    resize();
}

function startUp() {
    console.log(localStorage.getItem('booklist'));
    if(localStorage.getItem('booklist') == null){
        localStorage.setItem("booklist", JSON.stringify([]));
    }
    localStorage.setItem("currBook", "");
    localStorage.setItem("clickedPage", "");
}

class Book {
    pages = [];
    title = "title";
    theme = 2;
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

    bookList.style.width = 220 * Math.min(parseInt(bookContainer.offsetWidth/220), totalBooks) + "px";
}

async function updateBookList() {
    /* Der mangeler API kald i denne funktion */
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
    let localBooks = JSON.parse(localStorage.getItem("booklist"));
    for(i = 0; i < localBooks.length; i++) {
        const book = document.createElement("a");
        book.className = 'book';
        book.onclick = openBook;

        const title = document.createElement("div");
        title.appendChild(document.createTextNode(localBooks[i].title));
        book.appendChild(title);

        const edit = document.createElement("a");
        edit.className = 'hoverButton';
        edit.href = './pages.html';
        /* editLabel is a placeholder for an icon */
        const editLabel = document.createElement("div");
        editLabel.appendChild(document.createTextNode("edit"));
        edit.appendChild(editLabel);
        book.appendChild(edit);

        const print = document.createElement("a");
        print.className = 'hoverButton';
        /* printLabel is a placeholder for an icon */
        const printLabel = document.createElement("div");
        printLabel.appendChild(document.createTextNode("print"));
        print.appendChild(printLabel);
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