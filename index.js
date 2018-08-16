document.addEventListener("DOMContentLoaded", () => {

  fetchNotes(displayAllNotes)

// constants for html elements
  const authenticationHeaders = {'Content-Type': 'application/json', 'Accept': 'application/json'}


  const showAllNotes = document.getElementById('click-to-see-user-notes')
  const postsSidebar = document.getElementById('posts-sidebar')
  const singleNoteDisplayArea = document.getElementById("single-note-display-area")
  const newNoteForm = document.getElementById("new-note-form")
  const newNoteTitle = document.getElementById("new-note-title")
  const newNoteBody = document.getElementById("new-note-body")

//////////////////////////////////





// these function show all notes in the sidebar

  function fetchNotes(callback) {
    fetch('http://localhost:3000/api/v1/notes').then(resp => resp.json()).then(callback)
  }


  function displayAllNotes(data) {
    postsSidebar.innerHTML = "<h1><center>Notes</center></h1><br>"
    data = data.reverse()
    data.forEach(note => {
      let noteDiv = document.createElement("div")
      noteDiv.innerHTML = `<h2 id="sidebar-note-title-${note.id}" class="sidebar-note">${note.title}</h2><hr>`
      // <p id="sidebar-note-body-${note.id}">${note.body.slice(0, 10)}</p><hr>
      // noteDiv.id = `sidebar-note-${note.id}`
      // noteDiv.className = "sidebar-note"
      postsSidebar.appendChild(noteDiv)
    })
  }


  ///////////////////////////////////////////



// these functions fetch an individual note from the sidebar and display it in the main area of the page

  postsSidebar.addEventListener("click", (e) => {
    if (event.target.id.includes("sidebar-note")) {
      selectIndividualNote(event.target)
    }
  })

  function selectIndividualNote(target) {
    let idNum = target.id.split("-")
    idNum = idNum[idNum.length - 1]
    fetchIndividualNote(idNum, displayIndividualNote)
  }

  function fetchIndividualNote(id, callback) {
    fetch(`http://localhost:3000/api/v1/notes/${id}`).then(resp => resp.json()).then(data => callback(id, data))
  }


  function displayIndividualNote(id, note) {
    let selectedNote = document.createElement("div")
    selectedNote.innerHTML = `<div id="single-post-${id}"><h1>${note.title}</h1><p>${note.body}</p><br><button>Delete Note</button> <button>Edit Note</button></div>`
    selectedNote.className = "centered-single-note"
    singleNoteDisplayArea.innerHTML = selectedNote.innerHTML
    singleNoteDisplayArea.style.display = "block"
  }

//////////////////////////////////




// these function create a new note

  newNoteForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let newNote = {"title": `${newNoteTitle.value}`, "body": `${newNoteBody.value}`, "user_id": 1}
    createNewNote(newNote)
    newNoteTitle.value = ""
    newNoteBody.value = ""
  })

  function createNewNote(newNote) {
    fetch('http://localhost:3000/api/v1/notes', {method: 'POST', body: JSON.stringify(newNote), headers: authenticationHeaders}).then(data => fetchNotes(displayAllNotes))
  }

///////////////////////////////////


// these function delete a note

  singleNoteDisplayArea.addEventListener("click", (event) => {
    if (event.target.innerText === "Delete Note") {
      if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
        let noteId = event.target.parentElement.id.split("-")
        noteId = noteId[noteId.length - 1]
        singleNoteDisplayArea.style.display = "none"
        deleteNote(noteId)
      }
    }
  })

  function deleteNote(noteId) {
    fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {method: 'DELETE'}).then(data => fetchNotes(displayAllNotes))
  }


//////////////////////////////////


// these function edit a note

singleNoteDisplayArea.addEventListener("click", (event) => {
  if (event.target.innerText === "Edit Note") {
    let noteId = event.target.parentElement.id.split("-")
    noteId = noteId[noteId.length - 1]
    // event.target.parentElement.parentElement.style.display = "none"
    fetchIndividualNote(noteId, renderEditForm)
  }
})

function renderEditForm(noteId, note) {
  singleNoteDisplayArea.style.textAlign = "left"
  singleNoteDisplayArea.innerHTML = `
  <div id="single-post-${noteId}">
    <h3>Edit Note</h3>
    <form>
      <input id="new-note-title" type="text" name="title" value="${note.title}">
      <br><br>
      <textarea id="new-note-body" rows="4" cols="60" type="text-area" name="body">${note.body}</textarea>
      <br><br>
      <input type="submit" value="submit"> <button>Cancel</button>
    </form>
  </div>`
}

singleNoteDisplayArea.addEventListener("click", (event) => {
  event.preventDefault()
  event.stopPropagation()
  if (event.target.innerText === "Cancel") {
    let eventParent = event.target.parentElement.parentElement
    selectIndividualNote(eventParent)
  } else if (event.target.value === "submit") {
    // debugger
    let eventParent = event.target.parentElement.parentElement
    let noteId = eventParent.id.split("-")
    noteId = noteId[noteId.length - 1]
    let noteTitle = event.target.parentElement.querySelector('input').value
    let noteBody = event.target.parentElement.querySelector('textarea').value
    let updatedNote = {"id": `${noteId}`, "title": `${noteTitle}`, "body": `${noteBody}`, "user_id": 1}
    editNote(eventParent, updatedNote)
    // console.log(eventParent, updatedNote);
    // debugger
  }
})


function editNote(eventParent, updatedNote, authenticationHeaders) {
  const authHeaders = {'Content-Type': 'application/json', 'Accept': 'application/json'}
  fetch(`http://localhost:3000/api/v1/notes/${updatedNote.id}`, {method: 'PATCH', body: JSON.stringify(updatedNote), headers: authHeaders}).then(data => fetchNotes(displayAllNotes)).then(d => selectIndividualNote(eventParent))
}



//////////////////////////////////


})


// showAllNotes.addEventListener("click", (e) => {
//   e.preventDefault()
//   fetchNotes(displayAllNotes)
//   showAllNotes.classList.add("hidden")
//   postsSidebar.style.display = "block"
// })



// function fetchUsers(callback) {
//   fetch('http://localhost:3000/api/v1/users').then(resp => resp.json()).then(callback)
// }



// function displayUserNotes(user, userDiv) {
//   user.notes.forEach(note => {
//     return userDiv.innerHTML += `<h4>${note.title}</h4><p>${note.body}</p><hr>`
//   })
// }




// function displayUsers(data) {
//   // let allUsers = document.getElementById('all-users')
//   data.forEach(user => {
//     let userDiv = document.createElement("div")
//     userDiv.innerHTML = `<h1>${user.name}</h1> <h3>Posts:</h3>`
//     if (user.notes.length > 0) {
//       user.notes.forEach(note => {
//         userDiv.innerHTML += `<h4>${note.title}</h4><p>${note.body}</p><hr>`
//       })
//     }
//     postsSidebar.appendChild(userDiv)
//   })
// }



// let newUser = {"name": "Claudia"}
//
// fetch('http://localhost:3000/api/v1/users', {method: 'POST', body: JSON.stringify(newUser), headers:{authenticationHeaders}}).then(resp => resp.json()).then(console.log)

// let newPost = {
// "title": "ayyyyy",
// "body": "lmao",
// "user_id": 2
// }
//
// fetch('http://localhost:3000/api/v1/notes', {method: 'POST', body: JSON.stringify(newPost), headers:{authenticationHeaders}})















// function displayContent(data) {
//   let body = document.getElementById('body')
//   data.forEach(el => {
//     let div = document.createElement('div')
//     div.innerHTML = `<h3>${el.title}</h3>
//     <p><strong>User: </strong>${el.user.name}</p>
//     <p>${el.body}</p><hr>`
//     body.appendChild(div)
//   })
// }


// function verifyUser(data, input) {
//   // debugger
//   let inputUser = data.find(user => user.name === input)
//   console.log(inputUser);
//   // if (data.find(user => user.name === input)) {
//   //   welcomeForm.classList.add("hidden")
//   //   displayUsers(data)
//   // } else {
//   //   alert("that is not a valid username")
//   // }
// }
