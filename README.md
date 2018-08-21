# Waddler

An open source in-development Club Penguin emulator, written in Node.js.

# Features

* The first CP emulator to use custom encryption
* The first CP emulator to use Keccak256 for it's password hashing
* Stable and well written
* Uses the latest, fastest and securest modules
* Uses the latest crumbs
* Everything that is logged is stored in separate text files in a nice format
* Advanced multiplayer handler that allows you to add multiple minigames (supports Find Four and Mancala by default)
* Throttling system
* Comes with a command system (default commands are already added)
* Advanced censoring system
* Multiple plugins

# Setup

## Installation
* [Node.js](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com)
* [NGINX](https://www.nginx.com) or [APACHE](https://httpd.apache.org)
* Download and extract an Actionscript 2 mediaserver into your htdocs
* Download and extract Waddler into a folder

## MySQL
* In Waddler, go to `/setup/SQL/` and import the SQL file on something like PHPMYADMIN

## Mediaserver
* In Waddler, go to `/setup/mediaserver/airtower/` and open `airtower.rar`
* Replace the `airtower.swf` in your mediaserver (`/play/v2/client/`) with the one in `airtower.rar`

## Registration
* In Waddler, go to `/register/src/` and open config.json and enter your MySQL details
* Go back to the index folder of the register where `package.json` is located
* Open Command Prompt and enter `npm install`
* In the same folder where `package.json` is located, enter on Command Prompt `node runRegister.js`
* Browse to `yourdomain|yourip:6969` and make sure that MySQL is running

<b>If you're on a VPS, change the `action=` link in `/register/src/public/index.html`</b>

## Waddler
* In Waddler, go to `/src/` and open config.json and enter your MySQL details
* Go back to the index folder of Waddler where `package.json` is located
* Open Command Prompt and enter `npm install`
* In the same folder where `package.json` is located, enter on Command Prompt `node runLogin.js`
* Open another Command Prompt and browse to the folder where `package.json` is located using CD and enter on Command Prompt: `node runGame.js`
* Make sure MySQL, the register and your webserver are running