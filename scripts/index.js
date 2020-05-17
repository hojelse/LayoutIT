//Script til index.

let hoverButton;

window.onload = function() {
    hoverButton = document.getElementById("hoverButton");
    const book = document.getElementById("book");
    book.addEventListener('mouseenter', show);
    book.addEventListener('mouseleave', hide);
}

function show() {
    hoverButton.style.visibility = 'visible';
}

function hide() {
    hoverButton.style.visibility = 'hidden';
}