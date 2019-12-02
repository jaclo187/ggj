'use strict';

const init = () => {

    const wssURL = 'wss://students.btsi.lu/nodejaclo/wss'; // path has to include "/wss" as suffix for websocket connections using ws
    const wss = new WebSocket(wssURL);
    const promises = []; //contains promises send to the server

    const execute = (command, options, msg) => {
    /**
     * Sends an object to the websocket server
     * @param {String} command the message send to the websocket server
     * @param {Object} options an object containing the actual infromation
     * @param {String} msg Message for the promise object
     */
        return new Promise((resolve, reject) => {
        promises.push({msg: msg, resolve: resolve});
        let obj = {};
        Object.assign(obj, {command: command}, options);
        wss.send(JSON.stringify(obj)); 
        });
    };
  
};
  
  addEventListener('DOMContentLoaded', init);