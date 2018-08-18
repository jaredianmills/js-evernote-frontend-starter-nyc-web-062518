# js-evernote-frontend-starter-nyc-web-062518

This is a simple single user Evernote clone exercise. This is the frontend repo. The backend repo is here: https://github.com/jaredianmills/js-evernote-backend-starter-nyc-web-062518

To run it, run the backend server with `rails s` in terminal, then run the frontend server with `python -m SimpleHTTPServer 8080` and visit http://localhost:8080/

To run the app over a local network across multiple devices, do the following:

- Run `ifconfig` in terminal and look for your ip address.
- replace `localhost` in all of your fetch calls in the index.js file with your ip address
- boot your backend server with: `rails server -b 0.0.0.0`
- boot your frontend server with `python -m SimpleHTTPServer 8080`
- visit http://(your ip addresss):8080/
