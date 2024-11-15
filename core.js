function toggleDarkMode(){
    let darkTag = document.getElementById("theme")
    const theme = darkTag.attributes[1];
    console.log(darkTag.attributes[1]);
    if(darkTag.attributes[1].nodeValue === "dark"){
        theme.nodeValue = 'light'
    } else {
        theme.nodeValue = 'dark';
    }
}