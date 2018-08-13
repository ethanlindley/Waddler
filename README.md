# Waddler

An open source in-development Club Penguin emulator, written in Node.js.

# Features

* The first CP emulator to use custom encryption
* The first CP emulator to use Keccak256 for it's password hashing
* Stable and well written
* Uses the latest, fastest and securest modules

# Setup

* Download [the latest Node.js](https://nodejs.org/en/)
* Download this repository
* Extract it into a folder
* Run MYSQL and NGINX (or Apache)
* Conform your settings in `\src\config.json` and in `\register\src\config.json` (make sure they're both the same)
* If you're on a VPS, change the `action=` link in `\register\src\public`
* In your mediaserver, go to `\v2\client\` and replace that airtower.swf with the one in `\setup\airtower\`
* Open CMD and CD to Waddler's main folder where `package.json` is located
* Enter the command: `npm install`
* CD to `\register\`
* Enter the command: `npm install` again
* Enter the command: `cd..`
* Enter the command: `node runLogin.js`
* Open another CMD window, CD to Waddler's main folder and enter the command: `node runGame.js`
* Open another CMD window, CD to Waddler's `\register\` folder and enter the command: `node runRegister.js`
* Browse to `127.0.0.1:6969` or `localhost:6969` or `yourvpsdomain/ip:6969` to register