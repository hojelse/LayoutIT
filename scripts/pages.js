//Den her klasse skal kunne hente bruge hent fra api 
//til at sætte baggrundsfarven på id:"page" i editor.html

async function getColor() {
    const response = await fetch('https://itu-sdbg-s2020.now.sh/api/themes'); 
    const json = await response.json(); 




}

function addTheme(theme, index) {
    json.themes[index].forEach(element => {
        var s = theme.styles; 
    });
}