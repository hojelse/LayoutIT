//Scripts til at resize layoutet når vinduets størrelse ændrer sig.

function resizeLayoutInit(){
  const imagesList = document.querySelectorAll('.imagesCol')
  for (let i = 0; i < imagesList.length; i++) {
    makeResizableDiv(imagesList[i])
  }
}

function makeResizableDiv(imagesCol) {
  const imageContainer1 = imagesCol.querySelector('.imageContainer1');
  const imageContainer2 = imagesCol.querySelector('.imageContainer2');
  const resizer = imagesCol.querySelector('.resizer');

  const minimum_size = 100;
  let original_height_1 = 0;
  let original_y_1 = 0;
  let original_mouse_y = 0;
  if(resizer != undefined) setUp(resizer)

  function setUp(currentResizer) {
    currentResizer.addEventListener('mousedown', e => handleMouseStart(e));
    currentResizer.addEventListener("touchstart", e => handleTouchStart(e), false);
  }

  function handleMouseStart(e) {    
    e.preventDefault();
    original_height_1 = parseFloat(getComputedStyle(imageContainer1, null).getPropertyValue('height').replace('px', ''));
    original_height_images = parseFloat(getComputedStyle(imagesCol, null).getPropertyValue('height').replace('px', ''));
    original_y_1 = imageContainer1.getBoundingClientRect().top;
    original_mouse_y = e.pageY;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseEnd);
  }

  function handleMouseMove(e) {
    const height_1 = original_height_1 + (e.pageY - original_mouse_y)
    const height_2 = original_height_images - height_1
    if (height_1 > minimum_size && height_2 > minimum_size) {
      imageContainer1.style.flexGrow = round(height_1 / original_height_images, 3)
      imageContainer2.style.flexGrow = round(height_2 / original_height_images, 3)
    }
  }

  function handleMouseEnd() {
    window.removeEventListener('mousemove', handleMouseMove)
  }

  function handleTouchStart(e) {
    e.preventDefault();
    original_height_1 = parseFloat(getComputedStyle(imageContainer1, null).getPropertyValue('height').replace('px', ''));
    original_height_images = parseFloat(getComputedStyle(imagesCol, null).getPropertyValue('height').replace('px', ''));
    original_y_1 = imageContainer1.getBoundingClientRect().top;
    original_mouse_y = e.touches[0].clientY;
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  }

  function handleTouchMove(e) {
    const height_1 = original_height_1 + (e.touches[0].clientY - original_mouse_y)
    const height_2 = original_height_images - height_1
    if (height_1 > minimum_size && height_2 > minimum_size) {
      imageContainer1.style.flexGrow = round(height_1 / original_height_images, 3)
      imageContainer2.style.flexGrow = round(height_2 / original_height_images, 3)
    }
  }

  function handleTouchEnd() {
    window.removeEventListener('touchmove', handleTouchMove)
  }
}

function round(num, decimals){
  let decimalsFactor = Math.pow(10, decimals)
  return Math.round((num + Number.EPSILON) * decimalsFactor) / decimalsFactor
}