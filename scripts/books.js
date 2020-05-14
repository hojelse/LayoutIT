window.onload = function() {
    
    window.addEventListener('resize', resize);

    updateBookList();
    resize();
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
    for(i = 0; i < 5; i++) {
        const book = document.createElement("a");
        book.className = "book";
        book.href = "./pages.html";

        const title = document.createElement("div");
        title.appendChild(document.createTextNode("Book " + (i+1)));
        book.appendChild(title);


        bookList.appendChild(book);
    }
}