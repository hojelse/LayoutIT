let LAYOUTS = {
  ONE_IMAGE: 1,
  TWO_IMAGE: 2,
  THREE_IMAGE: 3,
  FOUR_IMAGE: 4
}

class Page {
  
  constructor(pageNumber) {
      this.pageNumber = pageNumber;
      this.texts = [];
      this.collectionOfImgBoxes = [null,null,null,null];
      this.layout = LAYOUTS.FOUR_IMAGE;
      this.resizeState = [1,1,1,1];
  }

  addImage(url) {
      for (let i = 0; i < this.collectionOfImgBoxes.length; i++) {
          let currentImgBox = this.collectionOfImgBoxes[i];
          if (currentImgBox === 'undefined' || currentImgBox === null){
              let newImgBox = new ImgBox();
              newImgBox.setURL(url);
              this.collectionOfImgBoxes[i] = newImgBox;
              clearImageBoxes();
              fillImageBoxes(this.collectionOfImgBoxes);
              break;
          }
      }
      thisbook.pages[currPageNumber-1] = this;
  }

  swapImage(a, b){       
      let temp = this.collectionOfImgBoxes[a];
      this.collectionOfImgBoxes[a] = this.collectionOfImgBoxes[b];
      this.collectionOfImgBoxes[b] = temp;
  }
}