window.onload = function() {
    
    window.addEventListener('resize', resize);


    updateBookList();
    resize();
}

function resize() {
    const bookList = document.getElementById("bookList");
    const bookContainer = document.getElementById("bookContainer");

    bookList.style.width = 220 * parseInt(bookContainer.offsetWidth/220);
}

/*window.onresize = function() {
    const bookList = document.getElementById("bookList");
    const bookContainer = document.getElementById("bookContainer");

    bookList.style.width = 220 * parseInt(bookContainer.offsetWidth/220);
}*/

async function updateBookList() {
    /* Der mangeler API kald i denne funktion */
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
    for(i = 0; i < 5; i++) {
        const book = document.createElement("div");
        book.className = "book";
        bookList.appendChild(book);
    }
}