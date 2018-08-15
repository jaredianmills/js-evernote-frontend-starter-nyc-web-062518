fetch('http://localhost:3000/api/v1/notes').then(resp => resp.json()).then(displayContent)

function displayContent(data) {
  let body = document.getElementById('body')
  data.forEach(el => {
    let div = document.createElement('div')
    div.innerHTML = `<h3>${el.title}</h3>
    <p><strong>User: </strong>${el.user.name}</p>
    <p>${el.body}</p><hr>`
    body.appendChild(div)
  })
}

// let newUser = {"name": "Seanrad"}
//
// fetch('http://localhost:3000/api/v1/users', {method: 'POST', body: JSON.stringify(newUser), headers:{'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(resp => resp.json()).then(console.log)
//
// let newPost = {
// "title": "dude",
// "body": "bro",
// "user_id": 2
// }
//
// fetch('http://localhost:3000/api/v1/notes', {method: 'POST', body: JSON.stringify(newPost), headers:{'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(resp => resp.json()).then(displayContent)
