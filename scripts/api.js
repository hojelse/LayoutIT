function getTheme(index) {
fetch('https://itu-sdbg-s2020.now.sh/api/themes')
.then(response => response.json())
.then(data => {
  console.log(data.themes[index]) // Prints result from `response.json()` in getRequest
})
.catch(error => console.error(error))
}




