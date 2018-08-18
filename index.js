document.addEventListener("DOMContentLoaded", () => {

  fetchNotes(displayAllNotes)

  setInterval(() => {
    fetchNotes(displayAllNotes)
  }, 1000)

  // requestIdleCallback(console.log('hello world'), { timeout: 1000 })
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
    // postsSidebar.innerHTML = "<h1 class='main-heading'><center>Notes</center></h1><input id='search-bar' type='text' placeholder='Search Notes'><br><hr>"
    postsSidebar.querySelectorAll('div').forEach(div => div.remove())

    data = data.reverse()
    // debugger
    data.forEach(note => {
      let noteDiv = document.createElement("div")
      noteDiv.innerHTML = `<div><h3 id="sidebar-note-title-${note.id}" class="sidebar-note">${note.title}</h2><hr></div>`
      // <p id="sidebar-note-body-${note.id}">${note.body.slice(0, 10)}</p><hr>
      noteDiv.id = `sidebar-note-${note.id}`
      noteDiv.className = "sidebar-note"
      postsSidebar.appendChild(noteDiv)
      // postsSidebar.innerHTML += `<div><h2 id="sidebar-note-title-${note.id}" class="sidebar-note">${note.title}</h2><hr></div>`
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
    fetch(`http://localhost:3000/api/v1/notes/${id}`).then(resp => resp.json()).then(note => callback(id, note))
  }


  function displayIndividualNote(id, note) {
    newNoteForm.classList.add("fadeOut")
    singleNoteDisplayArea.classList.add("fadeOut")
    setTimeout (() => {
      let selectedNote = document.createElement("div")
      selectedNote.innerHTML = `<div id="single-post-${id}"><h1>${note.title}</h1><p>${note.body}</p><br><button>Delete Note</button> <button>Edit Note</button></div>`
      selectedNote.className = "centered-single-note"
      singleNoteDisplayArea.innerHTML = `<button id="single-note-close-button">x</button>` + selectedNote.innerHTML
      singleNoteDisplayArea.style.textAlign = "center"
      singleNoteDisplayArea.classList.remove("fadeOut")
      newNoteForm.style.display = "none"
      singleNoteDisplayArea.style.display = "block"
      singleNoteDisplayArea.classList.add("fadeIn")
    }, 500)
  }

  singleNoteDisplayArea.addEventListener("click", (event) => {
    if (event.target.id === "single-note-close-button") {
      singleNoteDisplayArea.classList.remove("FadeIn")
      singleNoteDisplayArea.classList.add("FadeOut")
      setTimeout(() => {
        singleNoteDisplayArea.style.display = "none"
        newNoteForm.classList.remove("fadeOut")
        newNoteForm.style.display = "block"
        newNoteForm.classList.add("fadeIn")
        singleNoteDisplayArea.classList.remove("FadeOut")
      }, 500)
    }
  })

//////////////////////////////////




// these function create a new note

  newNoteForm.addEventListener("submit", (event) => {
    event.preventDefault()
    debugger
    if (newNoteTitle.value === "" || newNoteBody.value === "") {
      alert("A note must have both a title and a body.")
    } else {
      let newNote = {"title": `${newNoteTitle.value}`, "body": `${newNoteBody.value}`, "user_id": 1}
      createNewNote(newNote)
      newNoteTitle.value = ""
      newNoteBody.value = ""
    }
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
        document.getElementById("search-bar").value = ""
        deleteNote(noteId)
        newNoteForm.style.display = "block"
        newNoteForm.classList.remove("fadeOut")
        newNoteForm.classList.add("fadeIn")
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
    singleNoteDisplayArea.classList.add("FadeOut")
    setTimeout(()=> {
      fetchIndividualNote(noteId, renderEditForm)
      singleNoteDisplayArea.classList.remove("FadeOut")
      singleNoteDisplayArea.classList.remove("FadeOut")
    }, 500)
  }
})

function renderEditForm(noteId, note) {
  singleNoteDisplayArea.style.textAlign = "left"
  singleNoteDisplayArea.innerHTML = `
  <div id="single-post-${noteId}">
    <h3 class='main-heading'>Edit Note</h3>
    <form id="edit-note-form">
      <input id="edit-note-title" type="text" name="title" value="${note.title}">
      <br><br>
      <textarea id="edit-note-body" rows="4" cols="60" type="text-area" name="body">${note.body}</textarea>
      <br><br>
      <input type="Submit" value="Submit"> <button>Cancel</button>
    </form>
  </div>`
}

singleNoteDisplayArea.addEventListener("click", (event) => {
  event.preventDefault()
  event.stopPropagation()
  if (event.target.innerText === "Cancel") {
    let eventParent = event.target.parentElement.parentElement
    selectIndividualNote(eventParent)
  } else if (event.target.value === "Submit") {
    let eventParent = event.target.parentElement.parentElement
    let noteId = eventParent.id.split("-")
    noteId = noteId[noteId.length - 1]
    let noteTitle = event.target.parentElement.querySelector('input').value
    let noteBody = event.target.parentElement.querySelector('textarea').value
    let updatedNote = {"id": `${noteId}`, "title": `${noteTitle}`, "body": `${noteBody}`, "user_id": 1}
    editNote(eventParent, updatedNote)
  }
})


function editNote(eventParent, updatedNote, authenticationHeaders) {
  document.getElementById("search-bar").value = ""
  const authHeaders = {'Content-Type': 'application/json', 'Accept': 'application/json'}
  fetch(`http://localhost:3000/api/v1/notes/${updatedNote.id}`, {method: 'PATCH', body: JSON.stringify(updatedNote), headers: authHeaders}).then(data => fetchNotes(displayAllNotes)).then(d => selectIndividualNote(eventParent))
}

//////////////////////////////////



// these functions are responsible for searching the notes in the side bar


// const searchBar = document.getElementById("search-bar")

postsSidebar.addEventListener("keyup", (event) => {
  if (event.target.id === "search-bar") {
    let searchTerm = event.target.value
    // debugger
    if (searchTerm === "") {
      fetchNotes(displayAllNotes)
    } else {
      fetchAndFilterNotes(searchTerm, filterNotes)
    }
  }
})


function filterNotes(searchTerm, notes) {
  let filteredNotes = notes.filter(note => {
    // debugger
    return note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.body.toLowerCase().includes(searchTerm.toLowerCase())
  })
  displayAllNotes(filteredNotes)
}

function fetchAndFilterNotes(searchTerm, callback) {
  fetch('http://localhost:3000/api/v1/notes').then(resp => resp.json()).then(notes => callback(searchTerm, notes))
}


///////////////////////////////////

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
