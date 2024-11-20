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
    console.log("loading saved posts")
    const savedposts = JSON.parse(localStorage.getItem('addchild') || '[]');
    console.log(savedposts);
    savedoutput.innerHTML = '';

        if (savedposts.length === 0) {
            const noPostsMessage = document.createElement('div');
            noPostsMessage.className = 'no-posts-message';
            noPostsMessage.textContent = 'No posts found.';
            savedoutput.appendChild(noPostsMessage);
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
function savetolocal(kidid, kidname, nicelist, gifts,  timestamp, location) {
    try {
        console.log("saving to local")
        const post = {
            kidid: kidid,
            kidname: kidname,
            nicelist: nicelist,
            gifts: gifts,
            location: location,
            timestamp: timestamp
        };

        const savedposts = JSON.parse(localStorage.getItem('addchild') || '[]');

        if (!savedposts.some(p => p.kidid === kid.id)) {
            console.log('pushing post', savedposts)
            savedposts.push(post);
            console.log('pushed post', savedposts)
            localStorage.setItem('savedposts', JSON.stringify(savedposts));
            loadSavedPosts();
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
        const savedposts = JSON.parse(localStorage.getItem('addchild') || '[]');
        const postIdString = String(kidid);
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
                // const noPostsMessage = document.createElement('div');
                // noPostsMessage.className = 'no-posts-message';
                // noPostsMessage.textContent = 'No posts found. add a child';
                // output.appendChild(noPostsMessage);
                return;
            }
            // sort by timestamp
            const sortedPosts = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedPosts.forEach(post => {
                childlist.innerHTML += `
            <div class="post-item" id="post-${post.id}">
                <div class="grid post-content">
                <h3>${post.name}, on naughtylist: ${post.nicelist} gifts: ${post.gifts}</h3>
                    <button type="button" onclick="editPost('${post.id}')">edit</button>
                </div>            
                <div class="edit-form" style="display: none;">
                <div class="grid" id="edit-text">
                    <input type="text" placeholder="name" id="nameedit">
                    <input type="text" placeholder="location" id="locationedit">
                </div>
                <div class="grid">
                    <button type="button" onclick="savetolocal('${post.id}', '${post.name}', '${post.nicelist}', '${post.gifts}',  '${post.timestamp}', '${post.location}')">save</button>
                    <button type="button" onclick="cancelEdit(${post.id})">cancel</button>
                    <button type="button" class="outline" id="deletebutton">delete</button>
                    <button type="button">add book</button>
                    <button type="button">add toy</button>
                    <button type="button">add game</button>
                </div>
            </div>
            </div>
            `;
            });
        })
        .catch(error => console.log(error, ' error fetching posts:', e));
}

//add new kid
document.getElementById('addchild').addEventListener('click', () => {
console.log('clicked');   
    const newPost ={
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
            // DrawList();
        })
        .catch(error => console.log(error, ' error adding kid'));
        
});

// clear localstorage
document.getElementById('clearcache').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the cache?')) {
        localStorage.removeItem('savedposts');
        loadSavedPosts();
    }
});

function editPost(id) {
    const postdiv = document.getElementById(`post-${id}`);
    postdiv.querySelector('.post-content').style.display = 'none';
    postdiv.querySelector('.edit-form').style.display = 'grid';
    // postdiv.querySelector('.button-group').style.display = 'none';
}

function cancelEdit(id) {
    const postdiv = document.getElementById(`post-${id}`);
    postdiv.querySelector('.post-content').style.display = 'grid';
    postdiv.querySelector('.edit-form').style.display = 'none';
    // postdiv.querySelector('.button-group').style.display = 'block';
}



// DrawList();
const click = document.getElementById('lightbulbtoggle');
click.addEventListener('mousedown', toggleDarkMode);

// initial load
fetchdata();
loadSavedPosts();