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
        book.className = 'book';
        book.href = './pages.html'; /* Skal ændres til at gå til visning af bogen*/

        const title = document.createElement("div");
        title.appendChild(document.createTextNode("Book " + (i+1)));
        book.appendChild(title);

        const edit = document.createElement("a");
        edit.className = 'hoverButton';
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

        const spacing = (book.offsetHeight-2*edit.offsetHeight)/3;
        edit.style.bottom = spacing + "px";
        print.style.bottom = spacing*2 + edit.offsetHeight + "px";
    }
}