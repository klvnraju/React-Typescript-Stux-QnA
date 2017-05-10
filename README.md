# React-TypeScript-Stux

Minimal boilerplate for a single-page app using React, TypeScript with JSX support (TSX) and Stux as reflux implementation, and Visual Studio Code.

Implemented simple Questions and Answers section with sample data. And all AJAX calls are mocked to return dummy data after a second gap.
And you can quickly check what happens to UI when any of the AJAX calls fail.

## Usage

Note: Run commands from the root folder of the cloned repository.

To build the project from the command-line:

* Install [Node.js](https://nodejs.org/)
* `npm install`
* Note: For stux to build properly - copy typings\stux folder to @types folder inside node_modules folder.
* `npm run build`

To view the app in the browser:

* `npm run start`
* Open [http://localhost:8080/](http://localhost:8080/) in your browser of choice.

To develop using Visual Studio Code:

* Install [Visual Studio Code](https://code.visualstudio.com/).
* Open the root folder of the cloned repository.
* The `tasks.json` file is configured to run the TypeScript compiler in watch mode. Press Cmd+Shift+B on Mac or Ctrl+Shift+B on Windows or Linux to start the watcher.

To instantly view changes in the browser while developing:

* Run `npm run dev` in a terminal. This will start both `webpack` in watch mode and `http-server`. Hint: Visual Studio Code contains a built-in terminal.
