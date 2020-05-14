async function getThemes(){
    fetch('https://itu-sdbg-s2020.now.sh/api/themes')
    .then(response => response.json())
    .then(data => console.log('data is', data))
    .catch(error => console.log('error is', error));
}
 

