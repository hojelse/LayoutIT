let openbook;

window.onload = function(){
  openCity(event, 'pages') 

  document.getElementById('addPage').onclick = addPage;
  document.getElementById('setTitle').onclick = setTitle;

  startUp();
}

function startUp() {
  let localBooks = JSON.parse(localStorage.getItem("booklist"));
  let currBook = localStorage.getItem("currBook");
  for(var i = 0; i < localBooks.length; i++){
    if(localBooks[i].title == currBook){
      openbook = localBooks[i];
    }
  }
  
  let pageContainer = document.getElementById("pageContainer");
  let bookpages = openbook.pages;
  for(var i = 0; i < bookpages.length; i++){
    let newpage = document.createElement("button");
    newpage.onclick = toEditor;
    newpage.innerHTML = i+1;

    pageContainer.appendChild(newpage);
  }
}

function addPage() {
  let pages = openbook.pages;
  pages.push(new Page(pages.length));

  let localBooks = JSON.parse(localStorage.getItem("booklist"));
  for(var i = 0; i < localBooks.length; i++){
    if(localBooks[i].title == openbook.title){
      localBooks[i] = openbook;
    }
  }
  localStorage.setItem("booklist", JSON.stringify(localBooks));
  updatePages();
}

function setTitle() {
  let newtitle = document.getElementById("title").value;
  openbook.title = newtitle;

  let localBooks = JSON.parse(localStorage.getItem("booklist"));
  let currBook = localStorage.getItem("currBook");
  for(var i = 0; i < localBooks.length; i++){
    if(localBooks[i].title == currBook){
      localBooks[i] = openbook;
      currBook = openbook.title;
    }
  }
  localStorage.setItem("booklist", JSON.stringify(localBooks));
}

function updatePages() {
  let pageContainer = document.getElementById("pageContainer");
  pageContainer.innerHTML = "";
  let localBooks = JSON.parse(localStorage.getItem("booklist"));
  let currBook = localStorage.getItem("currBook");
  let bookpages = openbook.pages;
  
  for(var i = 0; i < bookpages.length; i++){
    let newpage = document.createElement("button");
    newpage.onclick = toEditor;
    newpage.innerHTML = i+1;

    pageContainer.appendChild(newpage);
  }
}

function toEditor() {
  console.log(window.event.target.innerHTML);
  localStorage.setItem("clickedPage", window.event.target.innerHTML);
  window.location.href = "./editor.html"
}
/*class Page {
  collectionOfImages = []
  
  constructor(pageNumber) {
      this.pageNumber = pageNumber;
      this.texts = [];
  }

  addImage(img) {
      this.collectionOfImages.push(img)
      clearImageBoxes()
      fillImageBoxes(this.collectionOfImages)
  }
}*/

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}