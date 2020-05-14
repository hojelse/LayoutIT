async function getTheames(){
    fetch('https://itu-sdbg-s2020.now.sh/api/themes')
    .then(response => response.json())
    .then(data => {
    // Here's a list of repos!
    console.log(data)
    }); 
}
 

