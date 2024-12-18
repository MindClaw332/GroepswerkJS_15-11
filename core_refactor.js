const inputName = document.getElementById('nameinput');
const inputNicelist = document.getElementById('nicelistinput');
const inputLocation = document.getElementById('locationinput');
const url = "http://localhost:3000/kids";
const output = document.getElementById('kidlist');
const addChildButton = document.getElementById('addchild')

// for practice i decided to change up the seen logic somewhat
// i decided to mainly use the api and keep the localstorage as a backup to load the data from


//draws the list of items it finds in local storage
function DrawList() {
    output.innerHTML = '';
    const localData = JSON.parse(localStorage.getItem('storedPosts'));
    localData.forEach(element => {
        console.log(element, 'element print')
        output.innerHTML += `
            <div class="post-item" id="post-${element.kidid}">
                <div class="grid post-content">
                <h3>${element.kidname}, nicelist: ${element.nicelist}, location: ${element.location}, gifts: ${element.gifts}</h3>
                    <button type="button" onclick="editPost('${element.kidid}')">edit</button>
                </div>            
                <div class="edit-form" style="display: none;">
                <div class="grid" id="edit-text">
                    <input type="text" placeholder="name" class="edit-name">
                    <input type="text" placeholder="location" class="edit-location">
                </div>
                <div class="grid">
                    <button type="button" onclick="savePost('${element.kidid}', '${element.kidname}', '${element.nicelist}', '${element.gifts}',  '${element.location}')">save</button>
                    <button type="button" onclick="cancelEdit(${element.kidid})">cancel</button>
                    <button type="button" class="outline" onclick="deletePost(${element.kidid})">delete</button>
                    <button type="button" onclick="AddGift('${element.kidid}','book')">add book</button>
                    <button type="button" onclick="AddGift('${element.kidid}','toy')">add toy</button>
                    <button type="button" onclick="AddGift('${element.kidid}','game')">add game</button>
                </div>
            </div>
            </div>
            `;
    })
}

// fetches data from api and stores it in local storage
function FetchDataAndSave() {
    console.log(JSON.parse(localStorage.getItem('savedPosts')) || [], 'voor fetch')
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No posts available. Add your first post!';
                output.appendChild(noPostsMessage);
                return;
            }
            const savedPosts = JSON.parse(localStorage.getItem('storedPosts')) || [];
            data.forEach(element => {
                console.log('in de loop')
                const newPost = {
                    kidid: element.id,
                    kidname: element.kidname,
                    nicelist: element.nicelist,
                    gifts: element.gifts,
                    location: element.location
                };
                if (!savedPosts.some(p => p.kidid === newPost.kidid))
                    savedPosts.push(newPost);
            })
            localStorage.setItem('storedPosts', JSON.stringify(savedPosts));
            DrawList();
        }
        )
        .catch(error => console.log(error, 'error'));
}

//allows you to open up the edit ui
function editPost(id) {
    // Show edit form and hide content for the selected post
    const postDiv = document.getElementById(`post-${id}`);
    postDiv.querySelector('.post-content').style.display = 'none';
    postDiv.querySelector('.edit-form').style.display = 'grid';
}

//closes the edit ui
function cancelEdit(id) {
    // Hide edit form and show content
    const postDiv = document.getElementById(`post-${id}`);
    postDiv.querySelector('.post-content').style.display = 'grid';
    postDiv.querySelector('.edit-form').style.display = 'none';
}


// adds a post to the api which will then call fetch and save so it can update the local storage too
function AddPost() {
    try{
    //create a new post
    const newPost = {
        kidname: document.getElementById('nameinput').value || 'name unknown',
        nicelist: document.getElementById('nicelistinput').value,
        gifts: [],
        location: document.getElementById('locationinput').value || 'unknown'
    }
    // add it to the api
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
        FetchDataAndSave();
        document.getElementById('nameinput').value = '';
        document.getElementById('nicelistinput').value = '';
        document.getElementById('locationinput').value = '';
    })}
    catch(error) {
        console.error('error occured while adding post', error)
    }

}

//deletes a selected post
function deletePost(id) {
    try{
        console.log('clicked delete')
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
        .then(() => FetchDataAndSave())
        .catch(e => console.error('Error deleting post:', e));
    }
    catch(error) {
        console.error('error occured while deleting post')
    }
    
}

//saves the edits made to a post
function savePost(id) {
    // Get the edited values
    const postDiv = document.getElementById(`post-${id}`);
    const newName = postDiv.querySelector('.edit-name').value;
    const newLocation = postDiv.querySelector('.edit-location').value;
    // Create updated post object
    const Patch = {
        kidname: newName,
        location: newLocation
    };

    // Send patch request to update only the necessary parts of the post
    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Patch)
    })
    .then(res => res.json())
    .then(() => {
        // Refresh the posts display
        FetchDataAndSave
    })
    .catch(e => console.error('Error updating post:', e));
}

//clears the local storage and empties out the api database
document.getElementById('clearcache').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved posts?')) {
        localStorage.clear;
        fetch(url)
        .then(res => res.json())
        .then(data => data.forEach(element =>{
            console.log('deleted kid#', element.id)
            fetch(`${url}/${element.id}`, {
                method: 'DELETE'
            })
        }))
        .then(()=> FetchDataAndSave())
        .catch(error => console.log(error))
    }
});

//adds a gift to a specified kid
function AddGift(kidid, gift){
    fetch(`${url}/${kidid}`) //get the object
    .then(res => res.json())
    .then(data => {
        //create a list of already added gifts
        const giftList = data.gifts;
        if(!giftList.includes(gift)){ //check if it already has this gift in it if it doesnt add it
            giftList.push(gift)
        } else {
            console.log('this list already contains a ',gift)
        }
        const giftpatch = {
            gifts: giftList
        }
        fetch(`${url}/${kidid}`, { // patch the gifts in
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(giftpatch)
        })
    })
    .then(() => FetchDataAndSave())
    .catch(error => console.log(error))
}

// localStorage.clear();
addChildButton.addEventListener('click', AddPost)
FetchDataAndSave();