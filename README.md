# Waddler

An open source in-development Club Penguin emulator, written in Node.js.

# Features

* The first CP emulator to use custom encryption
* The first CP emulator to use Keccak256 for it's password hashing
* Stable and well written
* Uses the latest, fastest and securest modules
* Contains a script to converts icer.ink's crumbs to be used with Waddler, allowing Waddler to use the latest crumbs
* Everything that is logged is stored in separate text files in a nice format
* Comes with modified Club Penguin files to conform Waddler

# Setup

1) Download [the latest Node.js](https://nodejs.org/en/)
2) Download this repository and extract it in some folder on your PC
3) Download an AS2 mediaserver
4) Install a HTTP webserver (nginx, XAMPP etc) and MYSQL
5) In the folder where you extracted Waddler, go to `\setup\mediaserver\`
6) Extract the AS2 mediaserver into htdocs of your webserver
7) Put `airtower.swf` from `\setup\mediaserver\airtower\airtower.rar` into your htdocs with the path `\play\v2\client\`
8) Put `pm.swf` from `\setup\mediaserver\pm\pm.swf` into your htdocs with the path `\play\v2\client\`
9) If you're on a VPS, open the file `loader.as` in `\setup\mediaserver\loader\com\hypeCP\` and edit `localhost` to what you need and then compile the swf with the included FLA
10) Put `loader.swf` from `\setup\mediaserver\loader\loader.swf` into `\play\`
11) Open `config.json` in the folder `\src\` (the folderwhere you extracted Waddler), and edit the configuration to your needs
12) Import the .sql file that is located in `\setup\SQL\`
13) Open `config.json` in `\register\src\` and make sure it's the same as the one in step 11
14) Enter in cmd: `cd..` and then enter: `npm install`
15) Go back to the folder where runLogin.js and runGame.js is located
16) Enter: `npm install`
17) If you're on a VPS, change the `action=` link in `\register\src\public\index.html`
18) Go back to the folder where runLogin and runGame.js is located
19) Enter: `node runLogin.js`
20) Open another cmd window and go back to the same directory and enter: `node runGame.js`
21) Open another cmd window and go back to the same directory but then to `/register/` and enter: `node runRegister.js`
22) Browse to `127.0.0.1:6969` or `localhost:6969` or `yourvpsdomain/ip:6969` to register
23) To play, go to the domain you use in the loader, for example (default): `localhost/play/loader.swf`