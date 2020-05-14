document.onkeydown = firekey;
console.log("press i:increaseValue o:setTo0 p:increaseValue")

function firekey(e) {
  e = e || window.event;

  switch(e.keyCode){
      case 73:
          let newVal = localStorage.getItem("x");
          localStorage.setItem("x", ++newVal);
          console.log(localStorage.getItem("x"));
          break;
      case 79:
          localStorage.setItem("x", 0);
          console.log(localStorage.getItem("x"));
          break;
      case 80:
          console.log(localStorage.getItem("x"));
          break;
          
  }
}