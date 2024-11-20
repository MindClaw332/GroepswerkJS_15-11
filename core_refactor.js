const inputName = document.getElementById('nameinput');
const inputNicelist = document.getElementById('nicelistinput');
const inputLocation = document.getElementById('locationinput');
const url = "http://localhost:3000/kids";
const output = document.getElementById('kidlist');


function DrawList() {
    const localData = JSON.parse(localStorage.getItem('storedPosts'));
    localData.forEach(element => {
        output.innerHTML += `
            <div class="post-item" id="post-${element.kidid}">
                <div class="grid post-content">
                <h3>${element.kidname}, on naughtylist: ${element.nicelist} gifts: ${element.gifts}</h3>
                    <button type="button" onclick="editPost('${element.kidid}')">edit</button>
                </div>            
                <div class="edit-form" style="display: none;">
                <div class="grid" id="edit-text">
                    <input type="text" placeholder="name" id="nameedit">
                    <input type="text" placeholder="location" id="locationedit">
                </div>
                <div class="grid">
                    <button type="button" onclick="savetolocal('${element.kidid}', '${element.kidname}', '${element.nicelist}', '${element.gifts}',  '${element.location}')">save</button>
                    <button type="button" onclick="cancelEdit(${element.kidid})">cancel</button>
                    <button type="button" class="outline" id="deletebutton">delete</button>
                    <button type="button">add book</button>
                    <button type="button">add toy</button>
                    <button type="button">add game</button>
                </div>
            </div>
            </div>
            `;
    })
}

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
                    kidname: element.name,
                    nicelist: element.nicelist,
                    gifts: element.gifts,
                    location: element.location
                };
                if(!savedPosts.some(p => p.kidid === newPost.kidid))
                savedPosts.push(newPost);
            })
            localStorage.setItem('storedPosts', JSON.stringify(savedPosts));
            DrawList();
        }
        )
        .catch(error => console.log(error, 'error'));
}

function editPost(id) {
    // Show edit form and hide content for the selected post
    const postDiv = document.getElementById(`post-${id}`);
    postDiv.querySelector('.post-content').style.display = 'none';
    postDiv.querySelector('.edit-form').style.display = 'grid';
}

function cancelEdit(id) {
    // Hide edit form and show content
    const postDiv = document.getElementById(`post-${id}`);
    postDiv.querySelector('.post-content').style.display = 'grid';
    postDiv.querySelector('.edit-form').style.display = 'none';
}

FetchDataAndSave();