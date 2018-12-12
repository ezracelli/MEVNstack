# Server Setup {.big}
MEVN Stack

---

# Prerequisites &mdash; Installing NPM

<!--
[`npm`](https://www.npmjs.com/) (node package manager) is a package manager like `yum` and `dnf`, Fedora's native package managers. It is a way to manage third-party software that runs on [`node.js`](https://nodejs.org/en/docs/), an engine for Javascript. (Javascript must be run via an engine, like Java must be run in the JVM. All web browsers have a JS engine build in, but `node.js` allows JS to be run outside the browser.)
-->

`npm` depends on `node.js`

```
# yum update
# yum install nodejs npm
```

---

# Instantiating the server

- [Vue](https://vuejs.org/)
- [@ebpack](https://webpack.js.org/)

<!--
To build this app, I used the framework [Vue](https://vuejs.org/) with the [webpack](https://webpack.js.org/) server [template](https://github.com/vuejs-templates/webpack). I used this so I could focus on the database and server setup.

To install the `vue-cli` tool, used for easily instantiating a Vue web app, run the following command. (The `--global` flag indicates a system-wide install versus a single-project install &mdash; `npm` can be used to install programs for use in only one folder.)

To instantiate the server with the webpack template, run the following command, replacing `$PROJECT_NAME` with the name of the project (in this case, `cst2415`). It downloads the necessary files from Vue's website.
-->

```
# npm install --global vue-cli
# vue init webpack $PROJECT_NAME
```

---

# Installing project dependencies

<!--
`vue init` only downloads the project skeleton, without any third-party dependencies. Installing all required third-party dependencies is as easy as:
-->

- Connect to `npm` repository where all programs are hosted (like `yum`)
- Downloads dependencies and locally installs
- No root access needed as files are placed and run within the folder `$PROJECT_NAME`

```
$ cd $PROJECT_NAME
$ npm install
```

---

# Installing project dependencies: `package.json`

<!--
This command consults the config file `package.json`, downloaded from the server. It lists all the third-party program dependencies of the project.

Here is a snippet of `package.json`, written in `JSON` (Javascript Object Notation):
-->

- JSON = Javascript Object Notation

```json
{
  "dependencies": {
    "vue": "^2.5.2",
  },
  "devDependencies": {
    "webpack": "^3.6.0",
    "webpack-dev-server": "^2.9.1",
  }
}
```

<!--
The command `npm install` looks in the `dependencies` and `devDependencies` objects to see what packages and what versions of those packages are required for the project. Running `npm install` with this `package.json` is exactly the same as running

```
$ npm install vue@^2.5.2
$ npm install vue-router@^3.0.1
$ npm install babel-core@^6.22.1
$ npm install babel-loader@^7.1.1
$ npm install css-loader@^0.28.0
...
```

Clearly, one command is better.
-->

---

# Front-end setup

<!-- The command to run the server is also easy. -->

```
$ npm run dev
```

- Same as `alias` keyword in `~/.bashrc`

```json
{
  "scripts": {
    "dev": "npm run webpack-server",
  }
}
```

- Frontend server running at `http://localhost:8080`
- Default page

<!--
Not only is `npm` a package manager, but it can also run scripts for you. It is analogous to writing a `bash` script. The scripts are defined in the `scripts` object of `package.json`. As you can see, `npm run dev` is a shortcut for `npm run webpack-server`, which is a shortcut for something else entirely.

Another way of thinking about scripts is `alias` in `~/.bashrc`. With `alias ll="ls -l"`, for example, you always have the `$ ll` shortcut accessible.

Once the server was running, open your browser and point it to `http://localhost:8080`. You should see a default webpage with the Vue logo, which means you're ready to move on to the next step.
-->

---

# Creating the app

<!--
I created a simple shopping list app. I'll gloss over the details because it's not relevant to this assignment, but for more detail, [check out the Vue documentation](https://vuejs.org/v2/guide/).

My app had one problem, though&mdash;none of the changes persisted! Every time I reloaded the page, my list was blank again. Obviously, the app wasn't connected to anything yet, so any changes were only made locally. I needed to connect it to a database.
-->

- App works as intended, create the list, add and delete items
- Changes do not persist
- No connection to any sort of database

---

# Back-end setup

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)

<!--
As the front-end is now running via `webpack-server`, the back-end needs a server to run on as well. There are a few options out there, but [Express](https://expressjs.com/) is the industry standard.

This new project dependency isn't in `package.json` yet, so we have two options. We could either add a line for it and `npm install` afterwards, but there's a shortcut.
-->

```
$ npm install --save express
```

<!-- The `--save` flag tells `npm` to edit `package.json` for us and add the line for `express` automatically. -->

```json
{
  "dependencies": {
    "express": "^4.16.4"
  }
}
```

---

# Create server framework

<!--
We need to make a new directory for our back-end server files, so
-->

```
$ mkdir server
$ cd server
$ touch index.js
```

---

# Create server framework: `express`

- Create directory `server` for the server-related files
- Enter `./server` and create a file `index.js`

<!--
I wrote our back-end server in this file, `index.js`. Again, I'll gloss over this part, because it's not important to this assignment, but here's a taste of the file structure so the next bit makes sense.
-->

```javascript
var express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello, world!'))

app.listen(8081)
```

<!--
To start this back-end server, we will run
-->

```
$ npm run prod
```

- Backend server running at `http://localhost:8081`
- Only response is `Hello, world!`

<!--
Now, if we visit `http://localhost:8081`, we should see the unformatted message, `Hello, world!`.
-->

---

# Make a database

- [mLab](https://mlab.com/welcome/) for MongoDB
- Non-relational or NoSQL database
- Data stored in `JSON`, same formatting as `package.json`
- Different kind of database than CST 1204

<!--
You'll need real live server hosting for this, because a database must be hosted in a place where it will always be accessible, from anywhere&mdash;not just when *your* server is running. An excellent free option is [mLab](https://mlab.com/welcome/), which implements MongoDB (an alternative to the traditional SQL-based database environment). I made a free account, created a database from their web client, and was ready to go.
-->

---

# Structure and write API

`http://localhost:8081/` already responds `Hello, world!`

- API means how to interact with the server
- What routes combined with that type of request

- `GET http://localhost:8081/list/items` retrieves all items
- `POST http://localhost:8081/list/items` adds a new item
- `GET http://localhost:8081/list/items/:itemId` retrieves one item
- `DELETE http://localhost:8081/list/items/:itemId`

<!--
Next, we need an API (Application Programming Interface) to consume our database. An API defines which URIs in the browser do what in the database. For example, the URI `http://localhost:8081/list/items` could send us all the `item`s in our database `list`, which contains the items in our shopping list, while the URI `http://localhost:8081/list/items/:itemId` (with `:itemId` meaning the unique identifier of an `item` in `list`) could send us only the item we're interested in.

Again I'll gloss over the actual code, because it's not important here, but the packages we need are `mongoose`, to connect to the database; `body-parser`, to send the proper type of request (whether we want to read from or write to the database); and `axios`, to connect the back-end to the front-end.
-->

```
npm install --save mongoose axios body-parser
```

---

# Running the finished server

<!--
After your back-end is set up, we need to run the back-end and front-end at the same time. To do this, we'll use the package `concurrently`.
-->

```
npm install --save concurrently
```

<!--
Next, we need to change the `dev` script to use `concurrently`. We'll edit `package.json` once more and change the following line from before. Every argument to `concurrently` is a command to run simultaneously.
-->

```json
{
  "scripts": {
-   "dev": "npm run webpack-server", // deleted
+   "dev": "concurrently \"npm run webpack-server\" \"npm run node-server\"",
  }
}
```

<!--
Now, `$ npm run dev` is the same as running `$ npm run webpack-server` and `$ npm run node-server` in two different terminals. So, let's
-->

- `dev` as an `alias` now maps to something longer & nested
- Would be a pain to write out the whole thing

```
$ npm run dev
```

- Both servers (frontend & backend) are running
- App is fully functional

<!--
Now, visiting `http://localhost:8080` shows the front-end, which consumes the API, accessing the database without the user knowing a thing one way or the other
 -->

---

# Building for production

<!--
We can't deploy our web app the way it is. There are many security flaws because the code we wrote, both on the front-end and the back-end, is totally visible to and editable any site visitors and so can be hacked very easily.

Luckily, there is a script, `build`, that condenses all our code into one file and obfuscates it, intentionally making it so confusing that it's impossible to know what it actually does.
-->

- Running as `dev` has security flaws
- Frontend code is visible & editable in browser, change app functionality
- Backend code is visible &mdash; exploitable
- No encryption

```
$ npm run build
# npm run prod
```

- Production server running at `http://localhost`, no port number necessary

<!--
Now we can visit `http://localhost`, and our whole app is there.
-->

---

<!--
# Deployment

We could deploy our app on any Node-based hosting service to provide 24/7 service, like Amazon Web Services, Google Cloud Platform, or Microsoft Azure. We chose to keep our server running locally (meaning it's only accessible while our computer&mdash;our server&mdash;is powered on with `npm run prod` running). Any other options is relatively pricey, but this is free.
-->

---

# Replication

<!--
To replicate our specific setup and view our open-source code, simply run the following commands, in order.
-->

```
# yum install git nodejs npm
$ git clone https://github.com/ezracelli/cst2415
$ cd cst2415
$ npm install
$ npm run build
$ npm run prod
```