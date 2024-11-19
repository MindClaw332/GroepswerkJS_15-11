const url = "http://localhost:3000/kids"
const childlist = document.getElementById("childlist")

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

function DrawList(){
    childlist.innerHTML = '';
fetch(url)
.then(res => res.json())
.then(data => {
    data.forEach(element => {
        childlist.innerHTML += `
         <div>
            <h3>${element.name} on nicelist: ${element.nicelist}</h3>
            <h3>${element.gifts}</h3>
        </div>
        <div id="default-button-group">
            <button>Add book</button> <button>Add clothes</button> <button>Add game</button> <button>edit</button>
        </div>
        `
    });
})
}
DrawList();
const click = document.getElementById('lightbulbtoggle');
click.addEventListener('mousedown', toggleDarkMode)