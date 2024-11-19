const url = "http://localhost:3000/kids"
const childlist = document.getElementById("kidlist")
const output = document.getElementById("output");
const savedoutput = document.getElementById("savedoutput");

function toggleDarkMode() {
    let darkTag = document.getElementById("theme");
    const lightbulb = document.getElementById("lightbulb");
    const theme = darkTag.attributes[1];
    console.log(darkTag.attributes[1]);
    if (darkTag.attributes[1].nodeValue === "dark") {
        theme.nodeValue = 'light'
        // lightbulb.style.color = 'gray';
    } else {
        theme.nodeValue = 'dark';
        // lightbulb.style.color = 'white'
    }
}

//drawlist debugged
//add kid to list api
//


function DrawList() {
    console.log('drawing')
    // childlist.innerHTML = '';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            data.forEach(element => {
                childlist.innerHTML += `
         <div>
         <div role="group">
                <h3>${element.name} and ${element.nicelist} gifts: ${element.gifts}</h3>
                <div>
                    <button id="edit">edit</button>
                </div>

            </div>
        `
            });
        })
        .catch(error => console.log(error, ' error has occured'))
}

// function AddGiftToKid(kidid, gift){
//     fetch(`${url}/${kidid}`)
//     .then(res => res.json)

// }

//load from db
function loadSavedPosts() {
    try {
        const savedposts = JSON.parse(localStorage.getItem('kids') || '[]');
        savedoutput.innerHTML = '';

        if (savedposts.length === 0) {
            const noPostsMessage = document.createElement('div');
            noPostsMessage.className = 'no-posts-message';
            noPostsMessage.textContent = 'No posts found.';
            childlist.appendChild(noPostsMessage);
            return;
        }
        // sort by timestamp
        savedposts.sort((a, b) => b.timestamp - a.timestamp);
        savedposts.forEach(post => {
            const postdiv = document.createElement('div');
            postdiv.className = 'kid';
            postdiv.innerHTML = `
            <h3>${post.name} on nicelist: ${post.nicelist}</h3>
            <h3>${post.gifts}</h3>
        `;
            childlist.appendChild(postdiv);
        });
    } catch (error) {
        console.error('Error loading saved posts:', error);
        localStorage.setItem('savedposts', '[]');
    }
}

//save to db
function savetolocal(kidid, gift, timestamp, location) {
    try {
        const post = {
            kidid: kidid,
            gift: gift,
            location: location,
            timestamp: timestamp
        };

        const savedposts = JSON.parse(localStorage.getItem('kids') || '[]');

        if (!savedposts.some(p => p.kidid === kid.id)) {
            savedposts.push(post);
            childlist.setItem('savedposts', JSON.stringify(savedposts));
        } else {
            alert('You have already saved this post.');
        }
    } catch (error) {
        console.error('Error saving post:', error);
    }
}

// remove post from db
function removepost(kidid) {
    try {
        const savedposts = JSON.parse(localStorage.getItem('kids') || '[]');
        const postIdString = string(kidid);
        const updatedPosts = savedposts.filter(post => post.kidid !== postIdString);
        childlist.setItem('savedposts', JSON.stringify(updatedPosts));
        loadSavedPosts();
    } catch (error) {
        console.error('Error removing post:', error);
    }
}

function fetchdata() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No posts found. add a child';
                output.appendChild(noPostsMessage);
                return;
            }
            // sort by timestamp
            const sortedPosts = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedPosts.forEach(post => {
                childlist.innerHTML += `
            <div class="post-item" id="${post.id}">
            <span class= "post-content">${post.name} (${post.nicelist}) (${post.location})(${post.timestamp})</span>
            <div class="edit" style="display: none;">
                <input type="text" class="edit-input" value="${post.name}">
                <input type="text" class="edit-input" value="${post.nicelist}">
                <input type="text" class="edit-input" value="${post.location}">
                <button class="button" onclick="savePost('${post.id}')">S</button>
                <button class="button" onclick="cancelEdit('${post.id}')">X</button>
            </div>
            <div class="button-group">
                <button onclick="editPost('${post.id}')">E</button>
                <button onclick="savetodb('${post.id}','${post.name}', '${post.gift}', '${post.timestamp}')">S</button>
                <button onclick="removepost('${post.id}')">X</button>
            </div>
            </div>
            `;
            });
        })
        .catch(error => console.log(error, ' error fetching posts:', e));
}

//add new kid
document.getElementById('addchild').addEventListener('click', () => {
    console.log('click');
    
    const newPost = {
        name: document.getElementById('name').value,
        nicelist: document.getElementById('nicelist').value,
        location: document.getElementById('location').value,
        gifts: '[]',
        timestamp: Date.now()
    };
    console.log('post created')
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
        .then(res => res.json())
        .then(() => {
            console.log('we got this far at least')
            fetchdata();
            document.getElementById('name').value = '';
            document.getElementById('nicelist').value = '';
            document.getElementById('location').value = '';
            DrawList();
        })
        .catch(error => console.log(error, ' error adding kid'));
        
});

fetchdata();
loadSavedPosts();
const click = document.getElementById('lightbulbtoggle');
click.addEventListener('mousedown', toggleDarkMode)