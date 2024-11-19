function toggleDarkMode(){
    let darkTag = document.getElementById("theme");
    const lightbulb = document.getElementById("lightbulb");
    const theme = darkTag.attributes[1];
    console.log(darkTag.attributes[1]);
    if(darkTag.attributes[1].nodeValue === "dark"){
        theme.nodeValue = 'light'
        // lightbulb.style.color = 'gray';
    } else {
        theme.nodeValue = 'dark';
        // lightbulb.style.color = 'white'
    }
}



const click = document.getElementById('lightbulbtoggle');
click.addEventListener('mousedown', toggleDarkMode)