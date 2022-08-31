# plankton-esbuild

This repo uses esbuild to automate building a simple webapp. Luckily I wrote a simple script that abstracts all of that away, like a good programmer.

<br/>
Simply do:

`npm run start`

This watches your `src/` directory for changes and recompiles `dist/client.min.js` and `dist/index.js`

<br/>
You can call:

`npm run serve`

Launches nodemon and watches for changes to `./dist/index.js` to restart the server

<br/>
You can also call:

`npm run build`

To NOT watch your src files and just do a one time compile to `dist/`