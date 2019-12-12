'use strict';

class WebSocketClient {

    constructor(){
        const wssURL = `ws://${location.host}`; 
        this.wss = new WebSocket(wssURL);
        this.promises = []; //contains promises send to the server
        console.log("Hello")
        this.wss.addEventListener('open', () => {
            console.log("WSS Opened")
            document.querySelector('#btn-modal-register').addEventListener('click', async e => {
                e.preventDefault();
                let data = this.getRegisterData();
                await this.execute('register', data, 'register');
            });
        });

    }
    
    execute (command, options, msg) {
    /**
     * Sends an object to the websocket server
     * @param {String} command the message send to the websocket server
     * @param {Object} options an object containing the actual infromation
     * @param {String} msg Message for the promise object
     */
        return new Promise((resolve, reject) => {
            this.promises.push({msg: msg, resolve: resolve});
            let obj = {};
            Object.assign(obj, {command: command}, options);
            this.wss.send(JSON.stringify(obj)); 
        });
    };

    getRegisterData () {
        let result = {};
        result.email = document.querySelector('#ipt-email-register').value;
        result.firstName = document.querySelector('#ipt-first-name-register').value;
        result.lastName = document.querySelector('#ipt-last-name-register').value;
        result.password = document.querySelector('#ipt-password-register').value;
        result.skill = document.querySelector('#ipt-skills-register').value;
        result.newsletter = document.querySelector('#ipt-newsletter-register').checked;
        return result
    };

    getLoginData () {
        let result = {};
        result.email = document.querySelector('#ipt-email-login').value;
        result.password = document.querySelector('#ipt-pwd-login').value;
        result.remember = document.querySelector('#ipt-remember-me-login').checked;
        return result;
    }
  
};
  
  addEventListener('DOMContentLoaded', new WebSocketClient);